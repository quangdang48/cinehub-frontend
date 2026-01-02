import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Alert, Avatar, RadioGroup } from "../common";
import type { UserDto } from "@/types/UserDto";
import type { UpdateUserDto } from "@/types/UpdateUserDto";

interface ProfileFormProps {
  user: UserDto;
  onUpdate?: (values: UpdateUserDto) => Promise<void>;
}

const profileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự")
    .required("Tên là bắt buộc"),
  gender: Yup.string().oneOf(["male", "female", "other"]),
});

export default function ProfileForm({ user, onUpdate }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [avatarUrl] = useState<string>("");

  const formik = useFormik<UpdateUserDto>({
    initialValues: {
      name: user.name || "",
      gender: user.gender || "male",
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setApiError("");
      setSuccessMessage("");

      try {
        if (onUpdate) {
          await onUpdate(values);
        }
        setSuccessMessage("Cập nhật thông tin thành công!");
      } catch (error: any) {
        setApiError(
          error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi cập nhật thông tin",
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleAvatarEdit = () => {
    // TODO: Implement avatar upload
    console.log("Edit avatar");
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Tài khoản</h2>
        <p className="text-gray-400 text-sm">Cập nhật thông tin tài khoản</p>
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
          <Avatar
            src={avatarUrl || undefined}
            alt={user.name}
            size="xl"
            editable
            onEdit={handleAvatarEdit}
          />
          <button
            type="button"
            onClick={handleAvatarEdit}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Ảnh cá nhân
          </button>
        </div>

        {/* Email Field */}
        <Input
          type="email"
          name="email"
          label="Email"
          placeholder="23110119@student.hcmute.edu.vn"
          value={user.email}
          readOnly={true}
          autoComplete="email"
        />

        {/* Name Field */}
        <Input
          type="text"
          name="name"
          label="Tên hiện thị"
          placeholder="Vu Nang Dang Khoa"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : undefined
          }
          autoComplete="name"
        />

        {/* Gender Field */}
        <RadioGroup
          label="Giới tính"
          name="gender"
          options={[
            { value: "male", label: "Nam" },
            { value: "female", label: "Nữ" },
          ]}
          value={formik.values.gender || "male"}
          onChange={(value) => formik.setFieldValue("gender", value)}
          error={
            formik.touched.gender && formik.errors.gender
              ? formik.errors.gender
              : undefined
          }
        />

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
          >
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
}
