import { StatusCodes } from "http-status-codes";
import { prisma } from "../../config/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";


export class AdminUserService {

    // =====================================================================
    // 1. LẤY DANH SÁCH USER (Hỗ trợ phân trang và tìm kiếm)
    // =====================================================================
    static async getAllUsers(page: number, limit: number, search: string) {
        // Tính toán số bản ghi cần bỏ qua (dùng cho phân trang)
        const skip = (page - 1) * limit;

        // Tạo điều kiện tìm kiếm. Nếu có chữ trong biến 'search', thì tìm trong Tên, Email hoặc Số điện thoại
        const whereCondition = search
            ? {
                OR: [
                    { fullName: { contains: search } },
                    { email: { contains: search } },
                    { phone: { contains: search } },
                ],
            }
            : {};

        // Chạy song song 2 câu lệnh bằng Promise.all để tối ưu tốc độ:
        // 1. Lấy danh sách user theo điều kiện phân trang
        // 2. Đếm tổng số lượng user thỏa mãn điều kiện tìm kiếm
        const [users, total] = await Promise.all([
            prisma.users.findMany({
                where: whereCondition,
                skip,
                take: limit,
                select: {
                    userId: true, email: true, fullName: true,
                    avt: true, role: true, phone: true, createdAt: true,
                    status: true,
                    // Lưu ý: Cố tình không select cột 'password' để bảo mật
                },
                orderBy: { createdAt: 'desc' }, // Sắp xếp mới nhất lên đầu
            }),
            prisma.users.count({ where: whereCondition }),
        ]);

        // Trả về data kèm theo thông tin meta để frontend vẽ phân trang
        return {
            users,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    // =====================================================================
    // 2. LẤY CHI TIẾT 1 USER THEO ID
    // =====================================================================
    static async getUserById(userId: string) {
        // Tìm user theo ID
        const user = await prisma.users.findUnique({
            where: { userId },
            select: { userId: true, email: true, fullName: true, avt: true, role: true, phone: true, createdAt: true },
        });

        // Nếu không tìm thấy trong database thì ném lỗi 404
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
        }
        return user;
    }

    // =====================================================================
    // 3. ADMIN TẠO USER MỚI
    // =====================================================================
    static async createUser(data: any) {
        // Bước 1: Kiểm tra xem email admin nhập vào đã có ai xài chưa
        const existingUser = await prisma.users.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new ApiError(StatusCodes.CONFLICT, "Email đã tồn tại trong hệ thống");
        }

        // Bước 2: Mã hóa mật khẩu trước khi lưu vào database (Băm 10 vòng)
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Bước 3: Lưu user mới vào database
        const newUser = await prisma.users.create({
            data: {
                userId: uuidv4(), // Tự động sinh chuỗi ID ngẫu nhiên
                email: data.email,
                password: hashedPassword, // Lưu cục password đã mã hóa
                fullName: data.fullName,
                phone: data.phone,
                role: data.role || "user", // Nếu không truyền role thì mặc định là 'user'
                avt: data.avt,
            },
        });

        // Bước 4: Tách cột password ra khỏi kết quả trước khi trả về cho Controller
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    // =====================================================================
    // 4. ADMIN CẬP NHẬT THÔNG TIN USER
    // =====================================================================
    static async updateUser(userId: string, data: any) {
        // Bước 1: Kiểm tra xem user này có tồn tại hay không
        const user = await prisma.users.findUnique({ where: { userId } });
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
        }

        // Tạo một object rỗng để chứa những trường dữ liệu cần cập nhật
        const updateData: any = {};

        // Bước 2: Xử lý vụ đổi email (Nếu admin gửi email lên và khác email hiện tại)
        if (data.email && data.email !== user.email) {
            // Phải check xem email mới này có đụng hàng với đứa nào khác không
            const existingUser = await prisma.users.findUnique({ where: { email: data.email } });
            if (existingUser) throw new ApiError(StatusCodes.CONFLICT, "Email này đã được sử dụng");
            updateData.email = data.email;
        }

        // Bước 3: Gắn các thông tin khác vào object update nếu có gửi lên
        if (data.fullName) updateData.fullName = data.fullName;
        if (data.phone) updateData.phone = data.phone;
        if (data.role) updateData.role = data.role;
        if (data.avt) updateData.avt = data.avt;

        // Bước 4: Nếu admin muốn đổi/cấp lại mật khẩu cho user thì mã hóa mật khẩu mới
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        // Bước 5: Thực hiện lưu vào DB
        const updatedUser = await prisma.users.update({
            where: { userId },
            data: updateData,
        });

        // Bóc mật khẩu ra rồi mới trả kết quả
        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }

    // =====================================================================
    // 5. ADMIN XÓA USER
    // =====================================================================
    static async deleteUser(userId: string) {
        // Bước 1: Check xem user có tồn tại không
        const user = await prisma.users.findUnique({ where: { userId } });
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy người dùng");
        }

        try {
            // Bước 2: Thực hiện xóa
            await prisma.users.delete({ where: { userId } });
            return { message: "Đã xóa người dùng thành công" };
        } catch (error: any) {
            // Bước 3: Bắt lỗi khóa ngoại (Foreign Key) của Prisma. 
            // Mã P2003 nghĩa là đang có dữ liệu ở bảng khác (như booking) liên kết với user này, nên ko xóa thẳng được.
            if (error.code === 'P2003') {
                throw new ApiError(StatusCodes.BAD_REQUEST, "Không thể xóa: Người dùng này đang có dữ liệu đặt sân hoặc bình luận.");
            }
            throw error; // Nếu lỗi khác thì cứ quăng ra cho hệ thống xử lý
        }
    }
}