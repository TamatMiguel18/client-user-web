import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerAgricultor } from "../../../shared/api";
import toast from "react-hot-toast";
import { 
    User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, 
    Phone, MapPin, Map, Sprout, Tractor 
} from "lucide-react";

export const RegisterForm = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Need FormData for the backend endpoint
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("surname", data.surname);
            formData.append("email", data.email);
            formData.append("password", data.password);
            
            // Campos de agricultor
            if (data.phone) formData.append("phone", data.phone);
            if (data.address) formData.append("address", data.address);
            if (data.department) formData.append("department", data.department);
            if (data.municipality) formData.append("municipality", data.municipality);
            if (data.farmerType) formData.append("farmerType", data.farmerType);
            if (data.mainCrop) formData.append("mainCrop", data.mainCrop);

            const response = await registerAgricultor(formData);
            const result = response.data;

            if (result.success) {
                toast.success(result.message || "Agricultor registrado exitosamente");
                reset();
                onLogin(); // Volver al login
            } else {
                toast.error(result.message || "Error al registrar agricultor");
            }
        } catch (error) {
            const msg = error.response?.data?.message 
                || error.response?.data?.title 
                || "Error al registrar agricultor";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Nombre */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Nombre</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Juan"
                            className={`w-full bg-white/[0.03] border ${errors.name ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium`}
                            {...register("name", { 
                                required: "Requerido",
                                minLength: { value: 2, message: "Mínimo 2" }
                            })}
                        />
                    </div>
                    {errors.name && <p className="text-rose-500 text-[10px] mt-1 ml-1">{errors.name.message}</p>}
                </div>

                {/* Apellido */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Apellido</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Pérez"
                            className={`w-full bg-white/[0.03] border ${errors.surname ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium`}
                            {...register("surname", { 
                                required: "Requerido",
                                minLength: { value: 2, message: "Mínimo 2" }
                            })}
                        />
                    </div>
                    {errors.surname && <p className="text-rose-500 text-[10px] mt-1 ml-1">{errors.surname.message}</p>}
                </div>

                {/* Correo */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Correo (Identidad Digital)</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            type="email"
                            placeholder="agricultor@correo.com"
                            className={`w-full bg-white/[0.03] border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium`}
                            {...register("email", { 
                                required: "Requerido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z|a-z]{2,4}$/i,
                                    message: "Correo inválido"
                                }
                            })}
                        />
                    </div>
                    {errors.email && <p className="text-rose-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
                </div>

                {/* Contraseña */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Llave de Seguridad</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className={`w-full bg-white/[0.03] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl py-3 pl-12 pr-12 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium`}
                            {...register("password", { 
                                required: "Requerida",
                                minLength: { value: 6, message: "Mínimo 6" }
                            })}
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)} 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-rose-500 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
                </div>

                {/* Teléfono */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Teléfono</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <Phone size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="12345678"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium"
                            {...register("phone")}
                        />
                    </div>
                </div>

                {/* Tipo de Productor */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Tipo de Productor</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors z-10">
                            <Tractor size={18} />
                        </div>
                        <select
                            className="w-full bg-[#0a0f18] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium appearance-none"
                            {...register("farmerType")}
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="0">Pequeño productor</option>
                            <option value="1">Mediano productor</option>
                            <option value="2">Cooperativa</option>
                            <option value="3">Empresa agrícola</option>
                        </select>
                    </div>
                </div>

                {/* Cultivo Principal */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Cultivo Principal</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <Sprout size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Ej: Maíz, Frijol, Café"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium"
                            {...register("mainCrop")}
                        />
                    </div>
                </div>

                {/* Departamento */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Departamento</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <Map size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Ej: Petén"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium"
                            {...register("department")}
                        />
                    </div>
                </div>

                {/* Municipio */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Municipio</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Ej: Flores"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium"
                            {...register("municipality")}
                        />
                    </div>
                </div>

                {/* Dirección completa (ocupa 2 columnas) */}
                <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Dirección Exacta</label>
                    <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                            <MapPin size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Calle, aldea, caserío..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/40 transition-all text-white text-sm font-medium"
                            {...register("address")}
                        />
                    </div>
                </div>

            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-800 disabled:cursor-not-allowed text-black font-black py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.4)] active:scale-95 relative overflow-hidden mt-6"
            >
                <span className={`flex items-center gap-3 transition-all duration-300 ${loading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}>
                    CREAR PERFIL AGRÍCOLA <UserPlus size={20} />
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
