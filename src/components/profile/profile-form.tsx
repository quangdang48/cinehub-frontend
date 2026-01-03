import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Alert, Avatar, RadioGroup } from "../common"; // Giả sử path đúng
import type { UserDto } from "@/types/UserDto";

interface ProfileFormProps {
  user: UserDto;
  // onUpdate giờ chỉ nhận FormData vì backend NestJS dùng FileInterceptor
  onUpdate: (formData: FormData) => Promise<void>;
}

// Mở rộng interface form values để chứa file
interface ProfileFormValues {
  name: string;
  gender: string;
  avatarFile: File | null;
}

const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .required("Tên là bắt buộc"),
  gender: Yup.string().oneOf(["male", "female"], "Giới tính không hợp lệ"),
  avatarFile: Yup.mixed()
    .nullable()
    .test("fileSize", "Kích thước ảnh quá lớn (Max 5MB)", (value: any) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Định dạng không hỗ trợ", (value: any) => {
      if (!value) return true;
      return ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(value.type);
    }),
});

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(user.avatarUrl);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== user.avatarUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, user.avatarUrl]);

  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      name: user.name || "",
      gender: user.gender || "male",
      avatarFile: null,
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("gender", values.gender);
        
        if (values.avatarFile) {
          formData.append("avatar", values.avatarFile);
        }

        await onUpdate(formData);
        
        setSuccessMessage("Cập nhật hồ sơ thành công!");
        formik.setFieldValue("avatarFile", null);
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi cập nhật thông tin"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("avatarFile", file);
      const objectUrl = URL.createObjectURL(file);
      console.log("Object URL:", objectUrl);
      setPreviewUrl(objectUrl);
      event.target.value = ""; 
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Tài khoản</h2>
        <p className="text-gray-400 text-sm">Cập nhật thông tin cá nhân và ảnh đại diện</p>
      </div>

      <Alert
        message={apiError}
        variant="error"
        onClose={() => setApiError("")}
      />
      <Alert
        message={successMessage}
        variant="success"
        onClose={() => setSuccessMessage("")}
      />

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-800">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp"
          />
          
          <div className="relative group">
            <Avatar
              src={previewUrl}
              alt={formik.values.name}
              size="xl"
            />
             {/* Overlay icon camera khi hover */}
            <div 
              className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleAvatarClick}
            >
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
          </div>

          <div className="flex flex-col items-center">
             <button
              type="button"
              onClick={handleAvatarClick}
              className="text-sm font-medium text-blue-500 hover:text-blue-400 transition"
            >
              Thay đổi ảnh đại diện
            </button>
            {/* Hiển thị lỗi file nếu có */}
            {formik.errors.avatarFile && (
              <span className="text-xs text-red-500 mt-1">
                {formik.errors.avatarFile as string}
              </span>
            )}
          </div>
        </div>

        {/* Email Field - Read Only */}
        <Input
          type="email"
          name="email"
          label="Email"
          value={user.email}
          readOnly
          disabled
          className="opacity-75 cursor-not-allowed"
        />

        {/* Name Field */}
        <Input
          type="text"
          name="name"
          label="Tên hiển thị"
          placeholder="Nhập tên của bạn"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
        />

        {/* Gender Field */}
        <RadioGroup
          label="Giới tính"
          name="gender"
          options={[
            { value: "male", label: "Nam" },
            { value: "female", label: "Nữ" },
          ]}
          value={formik.values.gender}
          onChange={(value) => formik.setFieldValue("gender", value)}
          error={formik.touched.gender && formik.errors.gender ? formik.errors.gender : undefined}
        />

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            className="w-full md:w-auto px-8"
            isLoading={isLoading}
            disabled={!formik.dirty && !formik.values.avatarFile} 
          >
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </div>
  );
}