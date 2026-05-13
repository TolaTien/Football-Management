import { useState } from 'react';

/**
 * LÝ DO TẠO FILE NÀY:
 * UmiJS hoạt động dựa trên "Convention over Configuration".
 * Mặc dù đã bật plugin `model: {}` trong `.umirc.ts`, nhưng nếu Umi không tìm thấy thư mục `src/models` có chứa file, nó sẽ không generate ra Hook `useModel` vào `@umijs/max`.
 * Việc tạo ra file `global.ts` này chỉ đơn giản là để thỏa mãn quy ước đó, kích hoạt Umi generate đầy đủ các type definitions cần thiết (như useModel, useNavigate) và loại bỏ lỗi gạch đỏ của TypeScript.
 */
export default function useGlobalModel() {
  const [name, setName] = useState<string>('PitchMaster');
  return {
    name,
    setName,
  };
}