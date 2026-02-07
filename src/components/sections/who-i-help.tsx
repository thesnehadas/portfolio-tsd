import React from 'react';

const WhoIHelp = () => {
  const personas = [
    {
      title: "Founders & entrepreneurs",
      quote: '"Can we automate our outbound so we can focus on closing deals?"',
    },
    {
      title: "Marketing & growth teams",
      quote: '"How do we scale content and SEO without hiring more writers?"',
    },
    {
      title: "Sales & ops teams",
      quote: '"Can we qualify leads and handle support without manual work?"',
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