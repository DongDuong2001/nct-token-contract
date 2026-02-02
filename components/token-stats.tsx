export function TokenStats() {
  const stats = [
    {
      label: "Max Supply",
      value: "100M",
      description: "NCT tokens",
    },
    {
      label: "Network",
      value: "Sepolia",
      description: "Ethereum testnet",
    },
    {
      label: "Standard",
      value: "ERC-20",
      description: "Token protocol",
    },
    {
      label: "Features",
      value: "3",
      description: "Mint, Burn, Pause",
    },
  ]

  return (
    <section className="border-b border-border bg-muted/30 py-20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="mb-3 text-4xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent md:text-5xl group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="mb-1 text-sm font-semibold text-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
