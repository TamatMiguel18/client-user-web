import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../../shared/api";
import { ShieldCheck, CheckCircle, XCircle, Loader2, ChevronLeft } from "lucide-react";

export const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("No se encontró el token de verificación en la URL.");
        }
    }, [token]);

    const handleVerify = async () => {
        setStatus("loading");
        try {
            const response = await verifyEmail(token);
            if (response.data.success) {
                setStatus("success");
                setMessage(response.data.message || "Tu correo ha sido verificado exitosamente.");
                // Redirigir al login después de unos segundos
                setTimeout(() => {
                    navigate("/auth"); // Ajusta la ruta de login si es necesario
                }, 3000);
            } else {
                setStatus("error");
                setMessage(response.data.message || "No se pudo verificar tu correo.");
            }
        } catch (error) {
            setStatus("error");
            setMessage(error.response?.data?.message || "Ocurrió un error al verificar tu correo.");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans flex items-center justify-center p-4">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02] mix-blend-overlay" />
            </div>

            <div className="relative w-full max-w-md bg-slate-950/80 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] text-center">
                <div className="mb-8 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                        <ShieldCheck size={32} className="text-emerald-500" />
                    </div>
                </div>

                <h2 className="text-3xl font-black text-white mb-2">Verificación de Correo</h2>
                
                <div className="py-8">
                    {status === "idle" && (
                        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-300">
                            <p className="text-slate-300 font-medium text-lg">Haz clic en el botón para verificar tu cuenta y comenzar a utilizar la plataforma.</p>
                            <button
                                onClick={handleVerify}
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-4 px-6 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] uppercase tracking-widest"
                            >
                                Verificar mi correo
                            </button>
                        </div>
                    )}

                    {status === "loading" && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 size={40} className="text-emerald-500 animate-spin" />
                            <p className="text-slate-400 font-medium">Verificando tu correo...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle size={40} className="text-emerald-400" />
                            </div>
                            <p className="text-emerald-400 font-bold">{message}</p>
                            <p className="text-slate-400 text-sm">Serás redirigido al inicio de sesión en breve...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center">
                                <XCircle size={40} className="text-rose-400" />
                            </div>
                            <p className="text-rose-400 font-bold">{message}</p>
                            <p className="text-slate-400 text-sm">Asegúrate de haber usado el enlace correcto o solicita uno nuevo.</p>
                        </div>
                    )}
                </div>

                {(status === "error" || status === "success") && (
                    <div className="mt-4 pt-6 border-t border-white/5">
                        <button
                            onClick={() => navigate("/auth")}
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
                        >
                            <ChevronLeft size={16} /> Volver al Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
