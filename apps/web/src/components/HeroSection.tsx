const HeroSection = () => {
  return (
    <div 
      className="relative h-96 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/assets/hero-dating.jpg)` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <img src="/logo-catalov.png" alt="Catalove" className="h-32 md:h-48 mb-0 drop-shadow-lg" />
      </div>
    </div>
  );
};

export default HeroSection;

