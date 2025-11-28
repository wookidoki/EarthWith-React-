import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Phone, Image, ArrowLeft, Send, MapPin } from 'lucide-react';
import { useRegister } from '../hooks/useRegister';

// InputField 컴포넌트를 내부 혹은 공용 컴포넌트로 분리 가능
const InputField = ({ label, icon: Icon, type = 'text', name, placeholder, error, value, onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <Icon className="w-4 h-4 mr-2 text-emerald-500" /> {label}
        </label>
        <input
            id={name} name={name} type={type} required value={value} onChange={onChange}
            className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-transparent'}`}
            placeholder={placeholder}
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
);

const RegisterPage = () => {
    const navigate = useNavigate();
    const { formData, validation, isLoading, previewUrl, handleChange, handleImageChange, handleSubmit } = useRegister();

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">회원가입</h1>
                    <button onClick={() => navigate('/login')} className="flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600 transition"><ArrowLeft className="w-4 h-4 mr-1" /> 로그인으로 돌아가기</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center border-b pb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-3"><Image className="w-4 h-4 mr-2 inline text-emerald-500" /> 프로필 이미지 (선택)</label>
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 hover:border-emerald-500 transition-colors cursor-pointer relative group" onClick={() => document.getElementById('profile-upload').click()}>
                            {previewUrl ? <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500"><User className="w-10 h-10" /></div>}
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><span className="text-white text-sm font-medium">업로드</span></div>
                            <input id="profile-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="이름" icon={User} name="name" placeholder="실명" value={formData.name} onChange={handleChange} error={validation.name} />
                        <InputField label="아이디" icon={User} name="userid" placeholder="사용할 아이디" value={formData.userid} onChange={handleChange} error={validation.userid} />
                        <InputField label="이메일" icon={Mail} type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} error={validation.email} />
                        <InputField label="휴대폰 번호" icon={Phone} name="phone" placeholder="010-1234-5678" value={formData.phone} onChange={handleChange} error={validation.phone} />
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center"><MapPin className="w-4 h-4 mr-2 text-emerald-500" /> 지역</label>
                            <select name="refRno" value={formData.refRno} onChange={handleChange} required className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 ${validation.refRno ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}>
                                <option value="" disabled>지역을 선택하세요</option>
                                <option value="1">서울</option>
                                <option value="2">부산</option>
                                <option value="10">경기도</option>
                            </select>
                            {validation.refRno && <p className="mt-1 text-xs text-red-500">{validation.refRno}</p>}
                        </div>

                        <InputField label="비밀번호" icon={Lock} type="password" name="password" placeholder="최소 6자 이상" value={formData.password} onChange={handleChange} error={validation.password} />
                        <InputField label="비밀번호 확인" icon={Lock} type="password" name="confirmPassword" placeholder="비밀번호 재입력" value={formData.confirmPassword} onChange={handleChange} error={validation.confirmPassword} />
                    </div>

                    {validation.apiError && <div className="text-center text-red-500 font-medium p-3 bg-red-50 rounded-lg">{validation.apiError}</div>}

                    <button type="submit" className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-lg shadow-lg text-white bg-emerald-600 hover:bg-emerald-700 font-bold transition-all mt-8 disabled:opacity-50" disabled={isLoading}>
                        {isLoading ? '처리 중...' : <><Send className="w-5 h-5 mr-2" /> 회원가입 완료</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;