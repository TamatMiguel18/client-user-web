import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

export const LoginForm = ({ onForgot }) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await login(data.emailOrUsername, data.password);
            toast.success("¡Bienvenido a SmartGrowGT!");
        } catch (error) {
            const msg = error.response?.data?.message 
                || error.message 
                || "Error de conexión. Intenta de nuevo.";
            toast.error(msg);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identidad Digital</label>
                <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                        <Mail size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder="agricultor@smartgrow.gt o usuario"
                        className={`w-full bg-white/[0.03] border ${errors.emailOrUsername ? 'border-red-500/50' : 'border-white/10'} rounded-[1.5rem] py-4 pl-14 pr-6 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white font-medium`}
                        {...register("emailOrUsername", { 
                            required: "El correo o usuario es obligatorio"
                        })}
                    />
                </div>
                {errors.emailOrUsername && (
                    <p className="text-rose-500 text-xs mt-1 ml-1">{errors.emailOrUsername.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Llave de Acceso</label>
                    <button
                        type="button"
                        onClick={onForgot}
                        className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-wider"
                    >
                        ¿Extraviaste tu llave?
                    </button>
                </div>
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
                            minLength: { value: 6, message: "Mínimo 6 caracteres" }
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

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed text-black font-black py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.4)] active:scale-95 relative overflow-hidden mt-6"
            >
                <span className={`flex items-center gap-3 transition-all duration-300 ${loading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                    CONECTAR <LogIn size={20} />
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
