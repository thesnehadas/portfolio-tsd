import React from 'react';

const WhoIHelp = () => {
  const personas = [
    {
      title: "Founders & entrepreneurs",
      quote: '"Can we automate our marketing so I’m not the bottleneck anymore?"',
    },
    {
      title: "Marketing & growth teams",
      quote: '"Which channels are actually working?"',
    },
    {
      title: "Data people & AI engineers",
      quote: '"How do I turn my notebooks into actual apps?"',
    },
  ];

  return (
    <section className="py-10 md:py-12 px-6 md:px-12 lg:px-24 max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl mb-16 font-display text-[#221f1c]">
        Who I help
      </h2>
      <div className="grid md:grid-cols-3 gap-8 md:gap-12">
        {personas.map((persona, index) => (
          <div key={index} className="group">
            <h3 className="text-lg font-sans font-medium mb-3 text-[#221f1c]">
              {persona.title}
            </h3>
            <p className="text-[#71717a] font-serif font-light italic text-xl leading-relaxed">
              {persona.quote}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhoIHelp;