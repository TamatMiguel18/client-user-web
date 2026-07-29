import { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../../shared/api";
import toast from "react-hot-toast";
import { Mail, ArrowRight, Loader2, CheckCircle } from "lucide-react";

export const ForgotForm = () => {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await forgotPassword(data.email);
            const result = response.data;

            if (result.success) {
                setSent(true);
                toast.success("Si el correo existe, recibirás un enlace de recuperación");
            } else {
                toast.error(result.message || "Error al enviar solicitud");
            }
        } catch (error) {
            toast.error("Error de conexión. Intenta de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={40} className="text-emerald-400" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-black text-white">¡Enlace enviado!</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                        Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
                    </p>
                </div>
                <p className="text-slate-600 text-xs">
                    Revisa tu bandeja de entrada y carpeta de spam.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                    Correo de Recuperación
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                        <Mail size={20} />
                    </div>
                    <input
                        type="email"
                        placeholder="agricultor@smartgrow.gt"
                        className={`w-full bg-white/[0.03] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-[1.5rem] py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white font-medium`}
                        {...register("email", {
                            required: "El correo es obligatorio",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z|a-z]{2,4}$/i,
                                message: "Correo inválido"
                            }
                        })}
                    />
                </div>
                {errors.email && (
                    <p className="text-rose-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed text-black font-black py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.4)] active:scale-95 relative overflow-hidden"
            >
                <span className={`flex items-center gap-3 transition-all duration-300 ${loading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                    SOLICITAR ENLACE <ArrowRight size={20} />
                </span>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin" />
                    </div>
                )}
            </button>
        </form>
    );
};
