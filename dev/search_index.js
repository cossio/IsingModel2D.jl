var documenterSearchIndex = {"docs":
[{"location":"examples/#Examples","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/#example_metropolis","page":"Examples","title":"Example simulation with Metropolis","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"import SquareIsingModel as Ising\nusing Statistics, CairoMakie, Random, ProgressMeter\n\nRandom.seed!(1) # make reproducible\n\nβs = 0:0.05:1 # inverse temperatures to simulate\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(50)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, m, E = Ising.metropolis!(spins, β, 10^7)\n    mavg[k] = mean(m[(length(m) ÷ 2):end])\n    mstd[k] = std(m[(length(m) ÷ 2):end])\nend\nmavg .= abs.(mavg) # remove sign invariance\n\nfig = Figure(resolution=(600,400))\nax = Axis(fig[1,1], xlabel=\"β\", ylabel=\"m\")\nlines!(ax, 0:0.01:1, Ising.onsager_magnetization, color=:black, label=\"analytical\")\nscatter!(ax, βs, mavg, color=:red, markersize=5, label=\"MC\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:red, whiskerwidth=5)\naxislegend(ax, position=:rb)\nfig","category":"page"},{"location":"examples/#example_wolff","page":"Examples","title":"Example simulation with Wolff","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"import SquareIsingModel as Ising\nusing Statistics, CairoMakie, Random, ProgressMeter\n\nRandom.seed!(1) # make reproducible\n\nβs = 0:0.05:1\nmavg = zeros(length(βs))\nmstd = zeros(length(βs))\nspins = Ising.random_configuration(70)\n@showprogress for (k,β) in enumerate(βs)\n    spins_t, m, E = Ising.wolff!(spins, β, 10^3)\n    mavg[k] = mean(abs.(m[(length(m) ÷ 2):end]))\n    mstd[k] = std(abs.(m[(length(m) ÷ 2):end]))\nend\nmavg .= abs.(mavg) # remove sign invariance\n\nfig = Figure(resolution=(600,400))\nax = Axis(fig[1,1], xlabel=\"β\", ylabel=\"m\")\nlines!(ax, 0:0.01:1, Ising.onsager_magnetization, color=:black, label=\"analytical\")\nscatter!(ax, βs, mavg, color=:red, markersize=5, label=\"MC\")\nerrorbars!(ax, βs, mavg, mstd/2, color=:red, whiskerwidth=5)\naxislegend(ax, position=:rb)\nfig","category":"page"},{"location":"examples/#Example-Wolff-clusters","page":"Examples","title":"Example Wolff clusters","text":"","category":"section"},{"location":"examples/","page":"Examples","title":"Examples","text":"import SquareIsingModel as Ising\nusing Random, Colors, ColorSchemes, CairoMakie\n\nRandom.seed!(69) # reproducibility\n\nβ = 0.6\nspins = Ising.random_configuration(50, 50)\nIsing.metropolis!(spins, β, 10^7)\ncluster = Ising.wolff_cluster(spins, 25, 25, 1 - exp(-2β))\n\nfig = Figure(resolution=(700, 300))\n\nax = Axis(fig[1,1], title=\"spins\")\nhmap = heatmap!(ax, spins, colormap=cgrad([:purple, :orange], [0.5]; categorical=true))\ncbar = Colorbar(fig[1,2], hmap)\ncbar.ticks = ([-0.5, 0.5], [\"-1\", \"1\"])\n\nax = Axis(fig[1,3], title=\"cluster\")\nhmap = heatmap!(ax, cluster, colormap=cgrad([:white, :black], [0.5]; categorical=true))\ncbar = Colorbar(fig[1, 4], hmap)\ncbar.ticks = ([0.25, 0.75], [\"0\", \"1\"])\n\nfig","category":"page"},{"location":"ising/#The-2-dimensional-Ising-model","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"","category":"section"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"The 2-dimensional Ising model is defined by the energy function:","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"E(mathbfsigma) = - sum_langle i j rangle sigma_i sigma_j","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"where langle i j rangle refers to connected pairs of sites in the square grid lattice, and sigma_i = pm 1 are spins. At inverse temperature beta, this defines a Boltzmann probability distribution:","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"P(mathbfsigma) = frac1Z mathrme^-beta E (mathbfsigma)","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"where","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"Z = sum_mathbfsigma mathrme^-beta E(mathbfsigma)","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"is the partition function.","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"In the two-dimensional grid lattice, we assume we have a Ltimes K plane grid, where each spin is connected to its four neighbors. We assume periodic boundary conditions, so spin (1,1) is connected to spin (L,K).","category":"page"},{"location":"ising/","page":"The 2-dimensional Ising model","title":"The 2-dimensional Ising model","text":"In the thermodynamic limit (large L with K = L), this model suffers a phase transition at the critical inverse temperature beta approx 044 (called βc in the package).","category":"page"},{"location":"reference/#Reference","page":"Reference","title":"Reference","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"This package doesn't export any symbols. ","category":"page"},{"location":"reference/#Grid-lattice","page":"Reference","title":"Grid lattice","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"SquareIsingModel.energy\nSquareIsingModel.adjacency_matrix\nSquareIsingModel.neighbors\nSquareIsingModel.neighbor_sum\nSquareIsingModel.random_configuration","category":"page"},{"location":"reference/#SquareIsingModel.energy","page":"Reference","title":"SquareIsingModel.energy","text":"energy(spins)\n\nComputes the energy of spins in the Ising 2-dimensional model.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.adjacency_matrix","page":"Reference","title":"SquareIsingModel.adjacency_matrix","text":"adjacency_matrix(L, K = L)\n\nAdjacency matrix of a L x K rectangular grid lattice.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.neighbors","page":"Reference","title":"SquareIsingModel.neighbors","text":"neighbors(i, j, L, K = L)\n\nReturns the list of neighbors of site (i,j) in the 2-dimensional lattice grid with sides L x K. That is, the sites ((i+1,j), (i-1,j), (i,j+1), (i,j-1)), but considering the periodic bounary conditions at the edges.\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.neighbor_sum","page":"Reference","title":"SquareIsingModel.neighbor_sum","text":"neighbor_sum(spins, i, j)\n\nSum of spins in neighbor sites of (i, j).\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.random_configuration","page":"Reference","title":"SquareIsingModel.random_configuration","text":"random_configuration(L, K = L)\n\nGenerate a random spin configuration.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Onsager-analytical-solution","page":"Reference","title":"Onsager analytical solution","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"SquareIsingModel.βc\nSquareIsingModel.onsager_magnetization","category":"page"},{"location":"reference/#SquareIsingModel.βc","page":"Reference","title":"SquareIsingModel.βc","text":"βc\n\nCritical temperature of the 2-dimensional infinite lattice Ising model determined by Onsager.\n\n\n\n\n\n","category":"constant"},{"location":"reference/#SquareIsingModel.onsager_magnetization","page":"Reference","title":"SquareIsingModel.onsager_magnetization","text":"onsager_magnetization(β)\n\nAnalytical magnetization of the two-dimensional Ising model found by Onsager in the thermodynamic limit.\n\n\n\n\n\n","category":"function"},{"location":"reference/#Monte-Carlo-simulations","page":"Reference","title":"Monte Carlo simulations","text":"","category":"section"},{"location":"reference/","page":"Reference","title":"Reference","text":"SquareIsingModel.metropolis!\nSquareIsingModel.wolff!","category":"page"},{"location":"reference/#SquareIsingModel.metropolis!","page":"Reference","title":"SquareIsingModel.metropolis!","text":"metropolis!(spins, β, steps = 1; save_interval = length(spins))\n\nPerfoms one or more Metropolis MC steps from the configuration spins, at inverse temperature β. Returns three lists: spins_t, m, E, where spins_t contains configurations sampled at intervals save_interval (by default equals the number of sites), m is the record of magnetizations, and E the record of energies (divided by number of sites).\n\n\n\n\n\n","category":"function"},{"location":"reference/#SquareIsingModel.wolff!","page":"Reference","title":"SquareIsingModel.wolff!","text":"wolff!(spins, β, steps = 1; save_interval = 1)\n\nPerfoms one or more Wolff MC steps from the configuration spins, at inverse temperature β.\n\n\n\n\n\n","category":"function"},{"location":"#SquareIsingModel.jl-Documentation","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"A simple Julia package to simulate the Ising model in a two-dimensional rectangular grid.","category":"page"},{"location":"#Package-Features","page":"SquareIsingModel.jl Documentation","title":"Package Features","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"Monte Carlo samplers for the 2D Ising model: Metropolis and Wolff.\nCompute and track energy, magnetization, and configurations during a simulation.\nAnalytical magnetization and critical temperature found by Onsager.","category":"page"},{"location":"#Outline","page":"SquareIsingModel.jl Documentation","title":"Outline","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"","category":"page"},{"location":"#main-index","page":"SquareIsingModel.jl Documentation","title":"Index","text":"","category":"section"},{"location":"","page":"SquareIsingModel.jl Documentation","title":"SquareIsingModel.jl Documentation","text":"Pages = [\"lib/public.md\"]","category":"page"}]
}
