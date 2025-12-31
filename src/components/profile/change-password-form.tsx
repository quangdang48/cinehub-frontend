import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input, Button, Alert } from "../common";
import { AuthService } from "@/services/AuthService";

const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Mật khẩu cũ là bắt buộc"),
    newPassword: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .matches(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
        .matches(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
        .matches(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
        .matches(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt")
        .required("Mật khẩu mới là bắt buộc"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Mật khẩu không khớp")
        .required("Xác nhận mật khẩu là bắt buộc"),
});

export default function ChangePasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");

    const formik = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: changePasswordSchema,
        onSubmit: async (values, { resetForm }) => {
            setIsLoading(true);
            setApiError("");
            setSuccessMessage("");

            try {
                await AuthService.changePassword({
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                });
                setSuccessMessage("Đổi mật khẩu thành công!");
                resetForm();
            } catch (error: any) {
                setApiError(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Có lỗi xảy ra khi đổi mật khẩu"
                );
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="bg-gray-900 rounded-lg p-6 md:p-8 border border-gray-800">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Đổi mật khẩu</h2>
                <p className="text-gray-400 text-sm">
                    Thay đổi mật khẩu để bảo vệ tài khoản của bạn
                </p>
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
                <Input
                    type="password"
                    name="oldPassword"
                    label="Mật khẩu cũ"
                    placeholder="Nhập mật khẩu cũ"
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.oldPassword && formik.errors.oldPassword
                            ? formik.errors.oldPassword
                            : undefined
                    }
                />

                <Input
                    type="password"
                    name="newPassword"
                    label="Mật khẩu mới"
                    placeholder="Nhập mật khẩu mới"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.newPassword && formik.errors.newPassword
                            ? formik.errors.newPassword
                            : undefined
                    }
                />

                <Input
                    type="password"
                    name="confirmPassword"
                    label="Xác nhận mật khẩu mới"
                    placeholder="Nhập lại mật khẩu mới"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.confirmPassword && formik.errors.confirmPassword
                            ? formik.errors.confirmPassword
                            : undefined
                    }
                />

                <div className="pt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        isLoading={isLoading}
                    >
                        Đổi mật khẩu
                    </Button>
                </div>
            </form>
        </div>
    );
}
