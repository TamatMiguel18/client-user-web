import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { ForgotForm } from "../components/ForgotForm";
import { ResetPasswordForm } from "../components/ResetPasswordForm";
import { Sprout, ShieldCheck, Map, Smartphone } from "lucide-react";

export const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isForgot, setIsForgot] = useState(false);
    
    const [searchParams] = useSearchParams();
    const isReset = searchParams.has("token");
    
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const checkAuth = useAuthStore(state => state.checkAuth);
    const navigate = useNavigate();

    // Redirigir si ya está autenticado
    useEffect(() => {
        checkAuth();
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate, checkAuth]);

    const getTitle = () => {
        if (isReset) return "Restablecer contraseña";
        if (isForgot) return "Recupera tu acceso";
        if (isLogin) return "Bienvenido de nuevo";
        return "Crea tu cuenta agrícola";
    };

    const getSubtitle = () => {
        if (isReset) return "Ingresa tu nueva contraseña para recuperar el acceso.";
        if (isForgot) return "Ingresa tu correo para recibir el enlace de recuperación.";
        if (isLogin) return "Accede a tu panel con tus credenciales de agricultor.";
        return "Regístrate para potenciar tus cultivos con tecnología.";
    };

    const handleGoToLogin = () => {
        setIsForgot(false);
        setIsLogin(true);
        if (isReset) {
            window.location.href = "/";
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-emerald-500/30 flex items-center justify-center p-4 lg:p-0 overflow-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className={`relative w-full max-w-[1200px] bg-slate-950/80 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row overflow-hidden transition-all duration-500 ease-in-out ${!isLogin && !isForgot && !isReset ? "h-auto min-h-[850px]" : "min-h-[700px]"}`}>
                
                {/* Panel Izquierdo (Branding / Info) */}
                <div className="lg:w-[45%] relative overflow-hidden hidden lg:flex flex-col justify-between p-16 border-r border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-emerald-500/5" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-1 border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/1892/1892751.png"
                                    alt="SmartGrowGT Logo"
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'/%3E%3C/svg%3E";
                                    }}
                                />
                            </div>
                            <span className="font-black text-3xl tracking-tighter text-white">SmartGrow<span className="text-emerald-500">GT</span></span>
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter">
                                Innovación para
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500"> tus cultivos. </span>
                            </h1>
                            <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
                                Optimiza el uso de fertilizantes, monitorea el suelo y toma decisiones basadas en datos.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-2 gap-6 mt-12">
                        {[
                            { icon: Map, label: "Precisión", val: "Mapeo" },
                            { icon: Smartphone, label: "Control", val: "Móvil" },
                            { icon: Sprout, label: "Cultivos", val: "Óptimos" },
                            { icon: ShieldCheck, label: "Seguro", val: "100%" }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md">
                                <item.icon className="text-emerald-500 mb-3" size={24} />
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</p>
                                <p className="text-lg font-bold text-white">{item.val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Panel Derecho (Formulario) */}
                <div className={`lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center transition-all ${!isLogin && !isForgot && !isReset ? 'overflow-y-auto max-h-[90vh]' : ''}`}>
                    <div className="space-y-8 w-full max-w-xl mx-auto">
                        <div className="space-y-3">
                            <h2 className="text-4xl font-black text-white tracking-tight">
                                {getTitle()}
                            </h2>
                            <p className="text-slate-400 font-medium max-w-lg">
                                {getSubtitle()}
                            </p>
                        </div>

                        <div className="bg-slate-900/50 border border-white/10 rounded-[2rem] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] backdrop-blur-md">
                            {isReset 
                                ? <ResetPasswordForm onLogin={handleGoToLogin} /> 
                                : isForgot 
                                    ? <ForgotForm /> 
                                    : isLogin 
                                        ? <LoginForm onForgot={() => setIsForgot(true)} /> 
                                        : <RegisterForm onLogin={handleGoToLogin} />}

                            {!isReset && !isForgot && (
                                <div className="mt-8 text-center border-t border-white/10 pt-6">
                                    {isLogin ? (
                                        <p className="text-sm text-slate-400">
                                            ¿Eres un nuevo agricultor?{' '}
                                            <button
                                                type="button"
                                                className="text-emerald-400 font-black hover:text-emerald-300 transition-colors ml-1"
                                                onClick={() => setIsLogin(false)}
                                            >
                                                Crear cuenta agrícola
                                            </button>
                                        </p>
                                    ) : (
                                        <p className="text-sm text-slate-400">
                                            ¿Ya eres parte de SmartGrowGT?{' '}
                                            <button
                                                type="button"
                                                className="text-emerald-400 font-black hover:text-emerald-300 transition-colors ml-1"
                                                onClick={() => setIsLogin(true)}
                                            >
                                                Iniciar sesión
                                            </button>
                                        </p>
                                    )}
                                </div>
                            )}

                            {isForgot && !isReset && (
                                <div className="mt-8 text-center border-t border-white/10 pt-6">
                                    <button
                                        type="button"
                                        className="text-emerald-400 font-black hover:text-emerald-300 transition-colors"
                                        onClick={() => setIsForgot(false)}
                                    >
                                        Volver al inicio de sesión
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
