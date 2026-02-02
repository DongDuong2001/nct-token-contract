import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coins, Flame, PauseCircle } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: Coins,
      title: "Mint Tokens",
      description:
        "Create new NCT tokens with role-based access control. Only authorized minters can create new tokens up to the max supply.",
    },
    {
      icon: Flame,
      title: "Burn Tokens",
      description:
        "Permanently remove tokens from circulation. Any token holder can burn their own tokens to reduce total supply.",
    },
    {
      icon: PauseCircle,
      title: "Pause Transfers",
      description:
        "Emergency pause functionality to halt all token transfers. Provides security in case of vulnerabilities or attacks.",
    },
  ]

  return (
    <section id="features" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Built with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Security</span>{" "}
            in Mind
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Neo-Culture Token leverages OpenZeppelin's battle-tested smart contracts to ensure maximum security and
            reliability.
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 ring-1 ring-primary/20">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-card-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
