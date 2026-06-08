import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../shared/api";
import toast from "react-hot-toast";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, CheckCircle, ChevronLeft } from "lucide-react";

export const ResetPasswordForm = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        if (!token) {
            toast.error("Token de recuperación no encontrado en la URL");
            return;
        }

        setLoading(true);
        try {
            const response = await resetPassword({
                token,
                newPassword: data.password
            });

            const result = response.data;

            if (result.success) {
                setSuccess(true);
                toast.success("Contraseña actualizada exitosamente");
            } else {
                toast.error(result.message || "Error al restablecer contraseña");
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Error al restablecer contraseña";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white">¡Contraseña actualizada!</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onLogin}
                    className="inline-flex items-center gap-2 text-emerald-400 font-black hover:text-emerald-300 transition-colors"
                >
                    <ChevronLeft size={16} /> Ir al Login
                </button>
            </div>
        );
    }

    if (!token) {
        return (
            <div className="text-center space-y-4 py-4">
                <p className="text-rose-400 font-bold">Token de recuperación no encontrado</p>
                <p className="text-slate-500 text-sm">
                    Asegúrate de usar el enlace completo que recibiste en tu correo.
                </p>
                <button
                    type="button"
                    onClick={onLogin}
                    className="inline-flex items-center gap-2 text-emerald-400 font-black hover:text-emerald-300 transition-colors"
                >
                    <ChevronLeft size={16} /> Volver al Login
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nueva Contraseña</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                        <Lock size={20} />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-[1.5rem] py-4 pl-14 pr-14 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white font-medium`}
                        {...register("password", {
                            required: "La contraseña es obligatoria",
                            minLength: { value: 8, message: "Mínimo 8 caracteres" }
                        })}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-rose-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Confirmar Contraseña</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                        <ShieldCheck size={20} />
                    </div>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className={`w-full bg-white/[0.03] border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-[1.5rem] py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white font-medium`}
                        {...register("confirmPassword", {
                            required: "Confirma tu contraseña",
                            validate: (value) => value === watch('password') || "Las contraseñas no coinciden"
                        })}
                    />
                </div>
                {errors.confirmPassword && (
                    <p className="text-rose-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed text-black font-black py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.4)] active:scale-95 relative overflow-hidden"
            >
                <span className={`flex items-center gap-3 transition-all duration-300 ${loading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                    ACTUALIZAR CONTRASEÑA <ShieldCheck size={20} />
                </span>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin" />
                    </div>
                )}
            </button>

            <div className="text-center">
                <button
                    type="button"
                    onClick={onLogin}
                    className="inline-flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]"
                >
                    <ChevronLeft size={16} /> Volver al Login
                </button>
            </div>
        </form>
    );
};
