const HeroSection = () => {
  return (
    <div 
      className="relative h-96 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(/assets/hero-dating.jpg)` }}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4 max-w-4xl">
          Find Your Perfect
          <span className="text-transparent bg-clip-text gradient-romance ml-3">
            Match
          </span>
        </h1>
        <p className="text-xl mb-8 max-w-2xl opacity-90">
          Discover meaningful connections with people who share your interests and values
        </p>
      </div>
    </div>
  );
};

export default HeroSection;

