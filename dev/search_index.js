var documenterSearchIndex = {"docs":
[{"location":"examples/hybrid/#Examples-using-hybrid-(Metropolis-Wolff)-sampling-method","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"","category":"section"},{"location":"examples/hybrid/#Magnetization-as-a-function-of-temperature","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Magnetization as a function of temperature","text":"","category":"section"},{"location":"examples/hybrid/","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"import SquareIsingModel as Ising\nusing Statistics, CairoMakie, Random, ProgressMeter\n\nRandom.seed!(1) # make reproducible\n\nβs = 0:0.025:1\nfig = Figure(resolution=(600,400))\nax = Axis(fig[1,1], xlabel=\"β\", ylabel=\"m\")\nlines!(ax, 0:0.01:1, Ising.onsager_magnetization, color=:black, label=\"analytical\")\n\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(30)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.hybrid!(spins, β, 10^7)\n    m = abs.(M[(length(M) ÷ 2):end]) / length(spins)\n    mavg[k] = mean(m)\n    mstd[k] = std(m)\nend\nscatter!(ax, βs, mavg, color=:blue, markersize=5, label=\"MC, L=30\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:blue, whiskerwidth=5)\n\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(70)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.hybrid!(spins, β, 10^7)\n    m = abs.(M[(length(M) ÷ 2):end]) / length(spins)\n    mavg[k] = mean(m)\n    mstd[k] = std(m)\nend\nscatter!(ax, βs, mavg, color=:red, markersize=5, label=\"MC, L=70\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:red, whiskerwidth=5)\n\naxislegend(ax, position=:rb)\nfig","category":"page"},{"location":"examples/hybrid/#Wolff-steps-are-mixed-with-Metropolis-steps","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Wolff steps are mixed with Metropolis steps","text":"","category":"section"},{"location":"examples/hybrid/","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"import SquareIsingModel as Ising\nusing CairoMakie, Random\n\nRandom.seed!(1) # make reproducible\nL = 50\nβ = Ising.βc\nT = 20\nΔ = 5\nspins = Ising.random_configuration(L)\nIsing.metropolis!(spins, β, 10^6) # equilibrate a bit to get clusters\nspins_t, M, E = Ising.hybrid!(spins, β, T; save_interval = 1, local_steps = Δ)\nfig = Figure(resolution=(600, 500))\nfor t ∈ 1:T\n    ax = Axis(fig[cld(t, Δ), mod1(t, Δ)])\n    hidedecorations!(ax)\n    heatmap!(ax, spins_t[:,:,t], colormap=cgrad([:purple, :orange], [0.5]; categorical=true))\nend\nfig","category":"page"},{"location":"examples/hybrid/","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"In the figure above, each row is a sequence of consecutive Metropolis steps. Inside a row the configurations are very similar differing in single sites. When the row ends, a Wolff cluster move is taken. It can be seen that the next row has suffered a larger change, since a cluster was flipped.","category":"page"},{"location":"examples/hybrid/#Magnetic-susceptibility","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Magnetic susceptibility","text":"","category":"section"},{"location":"examples/hybrid/","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"using Statistics, CairoMakie, Random\nimport SquareIsingModel as Ising\n\nRandom.seed!(1) # make reproducible\nTs = 2:0.01:3\nβs = inv.(Ts)\n\nfig = Figure(resolution=(600, 400))\nax = Axis(fig[1,1], xlabel=L\"temperature $T$ ($=1/\\beta$)\", ylabel=\"susceptibility\", yscale=log10)\n@time for (L, color) in zip([4, 8, 16, 32], [:green, :orange, :blue, :red])\n    χ = zeros(length(βs))\n    for (k, β) in enumerate(βs)\n        spins = Ising.random_configuration(L)\n        spins_t, M, E = Ising.hybrid!(spins, β, 10^6)\n        χ[k] = β/length(spins) * var(abs.(M))\n    end\n    scatter!(ax, Ts, χ, color=color, markersize=5, label=L\"L=%$L\")\nend\nvlines!(ax, [1 / Ising.βc], label=L\"Onsager's $T_c$\", color=:black, linestyle=:dash)\naxislegend(ax, position=:rt)\n\nfig","category":"page"},{"location":"examples/hybrid/#Heat-capacity","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Heat capacity","text":"","category":"section"},{"location":"examples/hybrid/","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"using Statistics, CairoMakie, Random\nimport SquareIsingModel as Ising\n\nRandom.seed!(1) # make reproducible\nTs = 1.5:0.01:3\nβs = inv.(Ts)\n\nfig = Figure(resolution=(600, 400))\nax = Axis(fig[1,1], xlabel=L\"temperature $T$ ($=1/\\beta$)\", ylabel=\"heat capacity\", yscale=log10)\n@time for (L, color) in zip([4, 8, 16, 32], [:green, :orange, :blue, :red])\n    C = zeros(length(βs))\n    for (k, β) in enumerate(βs)\n        spins = Ising.random_configuration(L)\n        spins_t, M, E = Ising.hybrid!(spins, β, 10^7)\n        C[k] = β^2/length(spins) * var(E)\n    end\n    scatter!(ax, Ts, C, color=color, markersize=5, label=L\"L=%$L\")\nend\nvlines!(ax, [1 / Ising.βc], label=L\"Onsager's $T_c$\", color=:black, linestyle=:dash)\naxislegend(ax, position=:lt) \n\nfig","category":"page"},{"location":"examples/hybrid/#Wolff-vs.-Metropolis-spin-flip-rates","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Wolff vs. Metropolis spin flip rates","text":"","category":"section"},{"location":"examples/hybrid/","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"At low temperatures, Wolff flips more spins per unit time than Metropolis. At high temperatures, Metropolis is more efficient. The crossing point approaches the critical temperature for larger system sizes.","category":"page"},{"location":"examples/hybrid/","page":"Examples using hybrid (Metropolis + Wolff) sampling method","title":"Examples using hybrid (Metropolis + Wolff) sampling method","text":"using Statistics, CairoMakie, Random\nimport SquareIsingModel as Ising\n\nRandom.seed!(1) # make reproducible\nTs = 1:0.5:5\nβs = inv.(Ts)\n\nfig = Figure(resolution=(600, 400))\nax = Axis(fig[1,1], xlabel=L\"temperature $T$ ($=1/\\beta$)\", ylabel=\"spin flips / second\", yscale=log10)\n@time for (L, color) in zip([4, 8, 16, 32], [:blue, :red, :orange, :green])\n    wolff_rates = zeros(length(βs))\n    local_rates = zeros(length(βs))\n    for (k, β) in enumerate(βs)\n        spins = Ising.random_configuration(L)\n        stats = Ising.HybridStats()\n        spins_t, M, E = Ising.dynamic_hybrid!(spins, β, 10^6; hybrid_stats=stats)\n        local_rates[k] = stats.local_flip / stats.local_time\n        wolff_rates[k] = stats.wolff_flip / stats.wolff_time\n    end\n    scatterlines!(ax, Ts, local_rates, markersize=15, label=L\"$L=%$L$ local\", color=color, marker='x', markercolor=color, linestyle=:dash)\n    scatterlines!(ax, Ts, wolff_rates, markersize=15, label=L\"$L=%$L$ wolff\", color=color, marker='o', markercolor=color, linestyle=:dot)\nend\nvlines!(ax, [1 / Ising.βc], label=L\"Onsager's $T_c$\", color=:black, linewidth=1)\n\nLegend(fig[1,2], ax)\n\nfig","category":"page"},{"location":"ising/#The-2-dimensional-Ising-model","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"","category":"section"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"The 2-dimensional Ising model is defined by the energy function:","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"E(mathbfsigma) = - sum_langle i j rangle sigma_i sigma_j","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"where langle i j rangle refers to connected pairs of sites in the square grid lattice, and sigma_i = pm 1 are spins. At inverse temperature beta, this defines a Boltzmann probability distribution:","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"P(mathbfsigma) = frac1Z mathrme^-beta E (mathbfsigma)","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"where","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"Z = sum_mathbfsigma mathrme^-beta E(mathbfsigma)","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"is the partition function.","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"In the two-dimensional grid lattice, we assume we have a Ltimes K plane grid, where each spin is connected to its four neighbors. We assume periodic boundary conditions, so spin (1,1) is connected to spin (L,K).","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"In the thermodynamic limit (large L with K = L), this model suffers a phase transition at the critical inverse temperature beta approx 044 (called βc in the package).","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"In this package, the system is simulated using the Metropolis algorithm or the Wolff cluster algorithm, both explained here:","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"Newman, Mark EJ, and G. T. Barkema. \"Monte Carlo Methods in Statistical Physics (1999).\" New York: Oxford 475 (1999).","category":"page"},{"location":"reference/#Reference","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"This package doesn't export any symbols. ","category":"page"},{"location":"reference/#Grid-lattice","page":"Reference","title":"Grid lattice","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"SquareIsingModel.energy\nSquareIsingModel.adjacency_matrix\nSquareIsingModel.neighbors\nSquareIsingModel.neighbor_sum\nSquareIsingModel.random_configuration","category":"page"},{"location":"reference/#SquareIsingModel.energy","page":"Reference","title":"SquareIsingModel.energy","text":"energy(spins)\n\nComputes the energy of spins in the Ising 2-dimensional model.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.adjacency_matrix","page":"Reference","title":"SquareIsingModel.adjacency_matrix","text":"adjacency_matrix(L, K = L)\n\nAdjacency matrix of a L x K rectangular grid lattice.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.neighbors","page":"Reference","title":"SquareIsingModel.neighbors","text":"neighbors(i, j, L, K = L)\n\nReturns the list of neighbors of site (i,j) in the 2-dimensional lattice grid with sides L x K. That is, the sites ((i+1,j), (i-1,j), (i,j+1), (i,j-1)), but considering the periodic bounary conditions at the edges.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.neighbor_sum","page":"Reference","title":"SquareIsingModel.neighbor_sum","text":"neighbor_sum(spins, i, j)\n\nSum of spins in neighbor sites of (i, j).\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.random_configuration","page":"Reference","title":"SquareIsingModel.random_configuration","text":"random_configuration(L, K = L)\n\nGenerate a random spin configuration.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Onsager-analytical-solution","page":"Reference","title":"Onsager analytical solution","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"SquareIsingModel.βc\nSquareIsingModel.onsager_magnetization","category":"page"},{"location":"reference/#SquareIsingModel.βc","page":"Reference","title":"SquareIsingModel.βc","text":"βc\n\nCritical temperature of the 2-dimensional infinite lattice Ising model determined by Onsager.\n\n\n\n\n\n","category":"constant"},{"location":"reference/#SquareIsingModel.onsager_magnetization","page":"Reference","title":"SquareIsingModel.onsager_magnetization","text":"onsager_magnetization(β)\n\nAnalytical magnetization of the two-dimensional Ising model found by Onsager in the thermodynamic limit.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Monte-Carlo-simulations","page":"Reference","title":"Monte Carlo simulations","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"SquareIsingModel.metropolis!\nSquareIsingModel.wolff!\nSquareIsingModel.hybrid!","category":"page"},{"location":"reference/#SquareIsingModel.metropolis!","page":"Reference","title":"SquareIsingModel.metropolis!","text":"metropolis!(spins, β, steps = 1; save_interval = length(spins))\n\nPerfoms one or more Metropolis MC steps from the configuration spins, at inverse temperature β. Returns three lists: spins_t, M, E, where spins_t contains configurations sampled at intervals save_interval (by default equals the number of sites), M is the record of magnetizations, and E the record of energies.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.wolff!","page":"Reference","title":"SquareIsingModel.wolff!","text":"wolff!(spins, β, steps = 1; save_interval = 1)\n\nPerfoms one or more Wolff MC steps from the configuration spins, at inverse temperature β.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.hybrid!","page":"Reference","title":"SquareIsingModel.hybrid!","text":"hybrid!(spins, β, steps = 1; save_interval = length(spins), local_steps = length(spins))\n\nHybrid sampler, performing local_steps of Metropolis sampling, then one Wolff cluster move, then another local_steps of Metropolis sampling, one more Wolff cluster move, and so on.\n\n\n\n\n\n","category":"function"},{"location":"examples/metropolis/#Examples-using-the-Metropolis-sampling-method","page":"Examples using the Metropolis sampling method","title":"Examples using the Metropolis sampling method","text":"","category":"section"},{"location":"examples/metropolis/#Magnetization-as-a-function-of-temperature","page":"Examples using the Metropolis sampling method","title":"Magnetization as a function of temperature","text":"","category":"section"},{"location":"examples/metropolis/","page":"Examples using the Metropolis sampling method","title":"Examples using the Metropolis sampling method","text":"import SquareIsingModel as Ising\nusing Statistics, CairoMakie, Random, ProgressMeter\n\nRandom.seed!(1) # make reproducible\n\nβs = 0:0.025:1\n\nfig = Figure(resolution=(600,400))\nax = Axis(fig[1,1], xlabel=\"β\", ylabel=\"m\")\nlines!(ax, 0:0.01:1, Ising.onsager_magnetization, color=:black, label=\"analytical\")\n\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(20)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.metropolis!(spins, β, 10^7)\n    m = abs.(M[(length(M) ÷ 2):end]) / length(spins)\n    mavg[k] = mean(m)\n    mstd[k] = std(m)\nend\nscatter!(ax, βs, mavg, color=:blue, markersize=5, label=\"MC, L=20\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:blue, whiskerwidth=5)\n\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(50)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.metropolis!(spins, β, 10^7)\n    m = abs.(M[(length(M) ÷ 2):end]) / length(spins)\n    mavg[k] = mean(m)\n    mstd[k] = std(m)\nend\nscatter!(ax, βs, mavg, color=:red, markersize=5, label=\"MC, L=50\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:red, whiskerwidth=5)\n\naxislegend(ax, position=:rb)\nfig","category":"page"},{"location":"#SquareIsingModel.jl-Documentation","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"A simple Julia package to simulate the Ising model in a two-dimensional rectangular grid.","category":"page"},{"location":"#Package-Features","page":"SquareIsingModel.jl Documentation","title":"Package Features","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"Monte Carlo samplers for the 2D Ising model: Metropolis and Wolff.\nCompute and track energy, magnetization, and configurations during a simulation.\nAnalytical magnetization and critical temperature found by Onsager.","category":"page"},{"location":"#Outline","page":"SquareIsingModel.jl Documentation","title":"Outline","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"","category":"page"},{"location":"#main-index","page":"SquareIsingModel.jl Documentation","title":"Index","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"Pages = [\"lib/public.md\"]","category":"page"},{"location":"examples/wolff/#Examples-using-Wolff-cluster-sampling-method","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"","category":"section"},{"location":"examples/wolff/#Magnetization-as-a-function-of-temperature","page":"Examples using Wolff cluster sampling method","title":"Magnetization as a function of temperature","text":"","category":"section"},{"location":"examples/wolff/","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"import SquareIsingModel as Ising\nusing Statistics, CairoMakie, Random, ProgressMeter\n\nRandom.seed!(1) # make reproducible\n\nβs = 0:0.025:1\nfig = Figure(resolution=(600,400))\nax = Axis(fig[1,1], xlabel=\"β\", ylabel=\"m\")\nlines!(ax, 0:0.01:1, Ising.onsager_magnetization, color=:black, label=\"analytical\")\n\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(30)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.wolff!(spins, β, 10^3)\n    m = abs.(M[(length(M) ÷ 2):end]) / length(spins)\n    mavg[k] = mean(m)\n    mstd[k] = std(m)\nend\nscatter!(ax, βs, mavg, color=:blue, markersize=5, label=\"MC, L=30\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:blue, whiskerwidth=5)\n\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(70)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.wolff!(spins, β, 10^3)\n    m = abs.(M[(length(M) ÷ 2):end]) / length(spins)\n    mavg[k] = mean(m)\n    mstd[k] = std(m)\nend\nscatter!(ax, βs, mavg, color=:red, markersize=5, label=\"MC, L=70\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:red, whiskerwidth=5)\n\naxislegend(ax, position=:rb)\nfig","category":"page"},{"location":"examples/wolff/#Typical-Wolff-clusters-at-criticality","page":"Examples using Wolff cluster sampling method","title":"Typical Wolff clusters at criticality","text":"","category":"section"},{"location":"examples/wolff/","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"import SquareIsingModel as Ising\nusing Random, Colors, ColorSchemes, CairoMakie\n\nRandom.seed!(62) # reproducibility\n\nβ = Ising.βc\nspins = Ising.random_configuration(400)\nIsing.metropolis!(spins, β, 10^7)\nIsing.wolff!(spins, β, 200)\n\ncluster = Ising.wolff_cluster(spins, 200, 200, Ising.wolff_padd(β))\n\nfig = Figure(resolution=(700, 300))\n\nax = Axis(fig[1,1], title=\"spins\")\nhmap = heatmap!(ax, spins, colormap=cgrad([:purple, :orange], [0.5]; categorical=true))\ncbar = Colorbar(fig[1,2], hmap)\ncbar.ticks = ([-0.5, 0.5], [\"-1\", \"1\"])\n\nax = Axis(fig[1,3], title=\"cluster\")\nhmap = heatmap!(ax, cluster, colormap=cgrad([:white, :black], [0.5]; categorical=true))\ncbar = Colorbar(fig[1, 4], hmap)\ncbar.ticks = ([0.25, 0.75], [\"0\", \"1\"])\n\nfig","category":"page"},{"location":"examples/wolff/#Average-size-of-Wolff's-clusters-as-a-function-of-temperature","page":"Examples using Wolff cluster sampling method","title":"Average size of Wolff's clusters as a function of temperature","text":"","category":"section"},{"location":"examples/wolff/","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"import SquareIsingModel as Ising\nusing Random, Statistics, Colors, ColorSchemes, CairoMakie, ProgressMeter\n\nRandom.seed!(1) # make reproducible\n\nTs = 0:0.2:5\nβs = inv.(Ts)\nfig = Figure(resolution=(600,400))\nax = Axis(fig[1,1], xlabel=L\"temperature $T$\", ylabel=L\"average Wolff's cluster size / $N$\")\n\nclavg = zeros(length(βs))\nclstd = zeros(length(βs))\nspins = Ising.random_configuration(30)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.wolff!(spins, β, 10^3)\n    cluster_size = abs.(M[2:end] - M[1:(end - 1)]) .÷ 2\n    clavg[k] = mean(cluster_size / length(spins))\n    clstd[k] = std(cluster_size / length(spins))\nend\nscatter!(ax, Ts, clavg, color=:blue, markersize=5, label=\"L=30\")\nlines!(ax, Ts, clavg, color=:blue)\nerrorbars!(ax, Ts, clavg, clstd/2, color=:blue, whiskerwidth=5)\n\nclavg = zeros(length(βs))\nclstd = zeros(length(βs))\nspins = Ising.random_configuration(70)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, M, E = Ising.wolff!(spins, β, 10^3)\n    cluster_size = abs.(M[2:end] - M[1:(end - 1)]) .÷ 2\n    clavg[k] = mean(cluster_size / length(spins))\n    clstd[k] = std(cluster_size / length(spins))\nend\nscatter!(ax, Ts, clavg, color=:red, markersize=5, label=\"L=70\")\nlines!(ax, Ts, clavg, color=:red)\nerrorbars!(ax, Ts, clavg, clstd/2, color=:red, whiskerwidth=5)\n\naxislegend(ax, position=:rt)\nfig","category":"page"},{"location":"examples/wolff/#Wolff-explores-configurations-efficiently-at-the-critical-temperature","page":"Examples using Wolff cluster sampling method","title":"Wolff explores configurations efficiently at the critical temperature","text":"","category":"section"},{"location":"examples/wolff/","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"The following example shows how at the critical temperature, the Metropolis sampler gets stuck in particular cluster structures. In contrast the Wolff algorihm explores diverse states.","category":"page"},{"location":"examples/wolff/","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"using Statistics, CairoMakie, Random\nimport SquareIsingModel as Ising\n\nRandom.seed!(3) # reproducibility\n\nL = 100\nN = L^2\nspins = Ising.random_configuration(100)\nspins .= 1\nspins_t_metro, M_metro, E_metro = Ising.metropolis!(spins, Ising.βc, 10^6);\nspins .= 1\nspins_t_wolff, M_wolff, E_wolff = Ising.wolff!(spins, Ising.βc, 10^4);\n\nfig = Figure(resolution=(1000, 650))\nfor (col, t) in enumerate(1:20:100)\n    ax = Axis(fig[1,col], title=\"t=$t, metropolis\")\n    heatmap!(ax, spins_t_metro[:,:,t], colormap=cgrad([:purple, :orange], [0.5]; categorical=true))\n    hidedecorations!(ax)\nend\nfor (col, t) in enumerate(1:2000:10000)\n    ax = Axis(fig[2,col], title=\"t=$t, wolff\")\n    heatmap!(ax, spins_t_wolff[:,:,t], colormap=cgrad([:purple, :orange], [0.5]; categorical=true))\n    hidedecorations!(ax)\nend\n\nax = Axis(fig[3,1:2], title=\"magnetization\")\nlines!(ax, M_wolff[1:10:end] / N, label=\"wolff\")\nlines!(ax, M_metro[1:1000:end] / N, label=\"metropolis\", linewidth=2, color=:red)\nylims!(ax, (-1,1))\nax = Axis(fig[3,3:4], title=\"energy\")\nlines!(ax, E_wolff[1:10:end] / N, label=\"wolff\")\nlines!(ax, E_metro[1:1000:end] / N, label=\"metropolis\", linewidth=2, color=:red)\naxislegend(ax, position = :rb)\n\nfig","category":"page"},{"location":"examples/wolff/#Binder's-parameter","page":"Examples using Wolff cluster sampling method","title":"Binder's parameter","text":"","category":"section"},{"location":"examples/wolff/","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"As the system size grows, the crossing point of the different curves is the critical temperature.","category":"page"},{"location":"examples/wolff/","page":"Examples using Wolff cluster sampling method","title":"Examples using Wolff cluster sampling method","text":"using Statistics, CairoMakie, Random\nimport SquareIsingModel as Ising\n\nRandom.seed!(1) # make reproducible\nTs = 2.2:0.01:2.3\nβs = inv.(Ts)\n\nfig = Figure(resolution=(600, 400))\nax = Axis(fig[1,1], xlabel=L\"temperature $T$ ($=1/\\beta$)\", ylabel=\"Binder parameter\")\n@time for (L, color) in zip([4, 8, 16, 32], [:green, :orange, :blue, :red])\n    U = zeros(length(βs))\n    spins = Ising.random_configuration(L)\n    for (k, β) in enumerate(βs)\n        spins_t, M, E = Ising.wolff!(spins, β, 10^5)\n        U[k] = (3 - mean(M.^4) / mean(M.^2)^2) / 2\n    end\n    scatter!(ax, Ts, U, color=color, markersize=5, label=L\"L=%$L\")\n    lines!(ax, Ts, U, color=color, markersize=5)\nend\nvlines!(ax, [1 / Ising.βc], label=L\"Onsager's $T_c$\", color=:black, linestyle=:dash)\naxislegend(ax, position=:lb) \n\nfig","category":"page"}]
}
