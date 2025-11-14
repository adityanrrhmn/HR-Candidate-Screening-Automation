import React, { useState, FormEvent, useEffect } from 'react';
import InputField from './components/InputField';
import Dropdown from './components/Dropdown';
import { FormData, FormErrors } from './types';
import { JOB_POSITIONS, API_ENDPOINT } from './constants';
import { BuildingIcon, UserIcon, MailIcon, CalendarIcon, PhoneIcon, LinkedInIcon, BriefcaseIcon, LinkIcon, CheckCircleIcon, XCircleIcon } from './components/Icons';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    fullName: '',
    dob: '',
    whatsappNumber: '',
    linkedin: '',
    jobPosition: '',
    cv: null,
    portfolio: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'idle'>('idle');
  const [submitMessage, setSubmitMessage] = useState<React.ReactNode>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);


  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required';
    if (!formData.whatsappNumber) newErrors.whatsappNumber = 'WhatsApp Number is required';
    if (!formData.jobPosition) newErrors.jobPosition = 'Job Position is required';
    if (!formData.cv) newErrors.cv = 'CV is required';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, cv: e.target.files![0] }));
      if (errors.cv) {
        setErrors(prev => ({ ...prev, cv: undefined }));
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      const firstErrorKey = Object.keys(validationErrors)[0] as keyof FormErrors;
      const errorElement = document.getElementById(firstErrorKey);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus({ preventScroll: true });
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage(null);

    const data = new window.FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'cv' && value instanceof File) {
          data.append(key, value);
      } else if (value !== null && typeof value === 'string') {
          data.append(key, value);
      }
    });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Application submitted successfully! We will get back to you soon.');
        setFormData({
          email: '',
          fullName: '',
          dob: '',
          whatsappNumber: '',
          linkedin: '',
          jobPosition: '',
          cv: null,
          portfolio: '',
        });
        setErrors({});
        const fileInput = document.getElementById('cv') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        setSubmitStatus('error');
        setSubmitMessage(`Submission failed: ${errorData.message}`);
      }
    } catch (error) {
      setSubmitStatus('error');
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
          const subject = 'HR Candidate Screening Demo Request';
          const body = `Hi, I'd like to request a demo for the HR Candidate Screening solution.
I'd also be interested in exploring the other workflow demos you offer, especially those related to recruitment and process automation. Please let me know the available time slots and any details I should prepare beforehand.`;
          const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=adity4n@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          
          setSubmitMessage(
            <span>
              N8N API endpoint could not be reached. Contact{' '}
              <a
                href={mailtoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-purple-400 hover:underline"
              >
                Aditya
              </a>{' '}
              to request a demo.
            </span>
          );
      } else {
          setSubmitMessage('An error occurred during submission. Please try again.');
      }
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  useEffect(() => {
    if (submitStatus !== 'idle') {
      const timer = setTimeout(() => setIsOverlayVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsOverlayVisible(false);
    }
  }, [submitStatus]);

  const iconClass = "h-5 w-5 text-teal-400/80";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-900">
      <div className="absolute top-0 left-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(19,78,74,0.3),rgba(255,255,255,0))]"></div>

      <div className="text-center mb-8">
        <div className="inline-block animate-float">
          <BuildingIcon className="h-16 w-16 text-purple-400" />
        </div>
        <h1 className="text-4xl font-bold text-slate-100 mt-4">Join Our Team</h1>
        <p className="text-slate-400 mt-2">Fill out the form below to apply for available positions</p>
      </div>

      <div className="max-w-2xl w-full mx-auto bg-slate-800/50 backdrop-blur-lg p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-700">
        <form onSubmit={handleSubmit} noValidate className="space-y-2">
          <InputField
            id="fullName"
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
            placeholder="Enter your full name"
            icon={<UserIcon className={iconClass} />}
          />
          <InputField
            id="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
            placeholder="example@email.com"
            icon={<MailIcon className={iconClass} />}
          />
          <InputField
            id="dob"
            label="Date of Birth"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            error={errors.dob}
            required
            icon={<CalendarIcon className={iconClass} />}
          />
          <InputField
            id="whatsappNumber"
            label="WhatsApp Number"
            type="tel"
            value={formData.whatsappNumber}
            onChange={handleChange}
            error={errors.whatsappNumber}
            required
            placeholder="+62 812 3456 7890"
            icon={<PhoneIcon className={iconClass} />}
          />
          <InputField
            id="linkedin"
            label="LinkedIn Profile URL"
            type="url"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="https://linkedin.com/in/yourprofile"
            icon={<LinkedInIcon className={iconClass} />}
          />
          
          <Dropdown
            id="jobPosition"
            label="Applying for Position"
            options={JOB_POSITIONS}
            value={formData.jobPosition}
            onChange={(value) => {
              setFormData(prev => ({ ...prev, jobPosition: value }));
              if (errors.jobPosition) {
                setErrors(prev => ({ ...prev, jobPosition: undefined }));
              }
            }}
            placeholder="Select a position"
            error={errors.jobPosition}
            required
            icon={<BriefcaseIcon className={iconClass} />}
          />
          
          <div>
            <label htmlFor="cv" className="flex items-center text-sm font-medium text-slate-400 mb-1">
              Upload CV <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="mt-1">
              <input
                id="cv"
                name="cv"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className={`block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0 file:text-sm file:font-semibold
                  file:bg-purple-500/10 file:text-purple-300 hover:file:bg-purple-500/20
                  file:transition-colors file:duration-200
                  cursor-pointer
                  ${errors.cv ? 'ring-2 ring-red-500/50 rounded-lg p-1' : ''}`}
              />
              <p className="mt-2 text-sm text-red-400 min-h-[1.25rem]">{errors.cv || ''}</p>
            </div>
          </div>

          <InputField
            id="portfolio"
            label="Portfolio URL"
            type="url"
            value={formData.portfolio}
            onChange={handleChange}
            placeholder="https://yourportfolio.com"
            icon={<LinkIcon className={iconClass} />}
          />

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 ease-in-out hover:shadow-purple-500/20 hover:-translate-y-px"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
      
      <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>
          Website Created by{' '}
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-purple-400 hover:underline"
          >
            Aditya
          </a>{' '}
          with Vibe Coding
        </p>
        <p className="mt-1">
          © 2025 - All rights reserved
        </p>
      </footer>

      {submitStatus !== 'idle' && (
        <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out ${isOverlayVisible ? 'bg-black/70 backdrop-blur-sm' : 'bg-opacity-0 backdrop-blur-none'}`}>
          <div className={`bg-slate-800/80 backdrop-blur-lg border border-slate-700 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full mx-auto transition-all duration-300 ease-out ${isOverlayVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4'}`}>
            {submitStatus === 'success' ? (
                <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto" />
            ) : (
                <XCircleIcon className="h-16 w-16 text-red-400 mx-auto" />
            )}
            <h3 className={`text-2xl font-bold mt-4 ${submitStatus === 'success' ? 'text-slate-100' : 'text-red-400'}`}>
              {submitStatus === 'success' ? 'Success!' : 'Submission Failed'}
            </h3>
            <div className="mt-2 text-slate-300 text-sm">{submitMessage}</div>
            <button 
              onClick={() => setSubmitStatus('idle')} 
              className="mt-6 w-full bg-purple-600 text-white py-2.5 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;