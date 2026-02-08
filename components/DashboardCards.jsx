export default function DashboardCards({ cards }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-xl border border-gray-200 p-6 card-shadow hover:card-shadow-lg transition-smooth"
        >
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">{card.title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
          {card.description && (
            <p className="text-gray-600 text-sm leading-relaxed">{card.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}
