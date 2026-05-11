import React from 'react';

const PlayerSignUp: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      

<div className="fixed inset-0 pitch-grid-bg opacity-30 pointer-events-none z-0"></div>
<main className="relative z-10 w-full max-w-[540px]">

<div className="text-center mb-xl">
<h1 className="font-h1 text-h1 text-primary mb-xs">PitchMaster</h1>
<p className="font-body-lg text-body-lg text-secondary">Precision booking for the beautiful game.</p>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">

<div className="h-1 bg-primary w-full"></div>
<div className="p-lg md:p-xl">
<div className="mb-lg">
<h2 className="font-h2 text-h2 text-primary">Create Your Player Profile</h2>
<p className="text-secondary font-body-md mt-xs">Step onto the field. Join thousands of local players.</p>
</div>
<form className="space-y-lg">

<div className="flex items-center gap-sm mb-lg">
<div className="h-1.5 flex-1 bg-primary rounded-full"></div>
<div className="h-1.5 flex-1 bg-secondary-container rounded-full"></div>
<div className="h-1.5 flex-1 bg-secondary-container rounded-full"></div>
</div>

<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="full_name">Full Name</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">person</span>
<input className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" id="full_name" name="full_name" placeholder="Cristiano Ronaldo" type="text"/>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="email">Email Address</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">mail</span>
<input className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" id="email" name="email" placeholder="player@pitchmaster.com" type="email"/>
</div>
</div>
<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="phone">Phone Number</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">phone_android</span>
<input className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" id="phone" name="phone" placeholder="+1 (555) 000-0000" type="tel"/>
</div>
</div>
</div>

<div className="space-y-xs">
<label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">Password</label>
<div className="relative">
<span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">lock</span>
<input className="w-full pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/15 focus:border-primary outline-none transition-all font-body-md" id="password" name="password" placeholder="••••••••" type="password"/>
</div>
<p className="text-[11px] text-outline italic">Must be at least 8 characters with one special symbol.</p>
</div>

<div className="flex items-start gap-sm py-sm">
<input className="mt-xs h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer" id="terms" name="terms" type="checkbox"/>
<label className="text-body-md text-secondary leading-tight cursor-pointer" htmlFor="terms">
                            I agree to the <a className="text-primary font-semibold hover:underline" href="#">Terms of Service</a> and 
                            <a className="text-primary font-semibold hover:underline" href="#">Privacy Policy</a>. I understand my data will be used to manage bookings.
                        </label>
</div>

<button className="w-full bg-primary text-on-primary font-button text-button py-md rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-sm" type="submit">
                        Create Account
                        <span className="material-symbols-outlined">arrow_forward</span>
</button>
</form>

<div className="mt-xl pt-lg border-t border-outline-variant text-center">
<p className="text-secondary font-body-md">
                        Already have a PitchMaster account? 
                        <a className="text-primary font-bold ml-xs hover:underline" href="#">Login here</a>
</p>
</div>
</div>
</div>

<div className="mt-lg flex flex-col md:flex-row items-center justify-between gap-md px-md opacity-70">
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>verified</span>
<span className="font-label-caps text-label-caps">Secure Player Data</span>
</div>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>sports_soccer</span>
<span className="font-label-caps text-label-caps">2,500+ Active Pitches</span>
</div>
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-primary" style={{"fontVariationSettings":"'FILL' 1"}}>bolt</span>
<span className="font-label-caps text-label-caps">Instant Booking</span>
</div>
</div>
</main>

<div className="fixed bottom-lg right-lg hidden xl:block z-0">
<div className="bg-surface-container-high p-lg rounded-xl border border-outline-variant max-w-[280px] shadow-sm">
<div className="flex items-center gap-md mb-md">
<img alt="Recent Player" className="w-12 h-12 rounded-full object-cover border-2 border-primary" data-alt="A professional close-up shot of a young, athletic football player smiling warmly. He is wearing a crisp white training kit with subtle forest green trim. The background is a softly blurred modern football stadium at sunset, with golden hour light catching the dewy blades of grass. The overall aesthetic is clean, professional, and inspiring, using a high-key lighting style to match a premium light-mode UI." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvWIylF8Uue7RHzcgh4OxSWrzF8TUFPdyZPaR_ZSbLtlU1ClqQQGcIq5Szo0szNVX61VuQ3FZChoWzNnnzEl7Sjit5T4tRRlkhhbJDIsbbHEpvEPqNZNwI3wodLgc_AnZFOrIIruJnqXvLjF1XOAKxn5LO4StWSvbzN6UK0XhtKEm9aZUDzuMKuikAIJ_9HPDi2_efSbHLd288h0abG8bFtynyCW65xW2y0OLHWsNndH-_cBVU0MnBsoD3TyI2HFtijg8uOh78ews"/>
<div>
<p className="font-button text-primary">Marcus J.</p>
<p className="text-[12px] text-secondary">Joined 2 mins ago</p>
</div>
</div>
<p className="text-body-md text-on-surface-variant italic">"Found a local 5-a-side match within minutes. The best pitch management platform I've used."</p>
</div>
</div>

    </div>
  );
};

export default PlayerSignUp;
