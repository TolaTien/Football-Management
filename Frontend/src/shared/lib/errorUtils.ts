interface AxiosErrorShape {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

/**
 * Extract a user-friendly error message from an Axios error or any unknown error.
 * @param err - The caught error
 * @param fallback - Fallback message if nothing else found
 */
export const extractErrorMessage = (err: unknown, fallback = 'Đã xảy ra lỗi'): string => {
  const axiosErr = err as AxiosErrorShape;
  return axiosErr?.response?.data?.message ?? axiosErr?.message ?? fallback;
};
