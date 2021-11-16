"""
    metropolis!(spins, β, steps = 1; save_interval = length(spins))

Perfoms one or more Metropolis MC steps from the configuration `spins`, at inverse
temperature `β`.
Returns three lists: `spins_t, M, E`, where `spins_t` contains configurations
sampled at intervals `save_interval` (by default equals the number of sites),
`M` is the record of magnetizations, and `E` the record of energies.
"""
function metropolis!(
    spins::AbstractMatrix{Int8},
    β::Real, steps::Int = 1;
    save_interval::Int = length(spins)
)
    @assert steps ≥ 1
    @assert save_interval ≥ 1

    #= We only need to evalute exp.(-β .* ΔE) for ΔE = 0, 1, 2, 3.
    Therefore we store a look-up table. =#
    _Exp2β = metropolis_acceptance_probabilities(β)

    #= Track history of magnetization and energy =#
    M = zeros(Int, steps)
    E = zeros(Int, steps)

    M[1] = sum(spins) # magnetization
    E[1] = energy(spins)

    #= Track the history of configurations only every 'save_interval' steps. =#
    spins_t = zeros(Int8, size(spins)..., length(1:save_interval:steps))
    spins_t[:,:,1] .= spins

    for t ∈ 2:steps
        metropolis_step!(spins; t = t, M = M, E = E, _Exp2β = _Exp2β)
        if t ∈ 1:save_interval:steps
            spins_t[:, :, cld(t, save_interval)] .= spins
        end
    end

    return spins_t, M, E
end

function metropolis_step!(spins; t, M, E, _Exp2β)
    i, j = rand.(Base.OneTo.(size(spins)))
    S = spins[i,j] * neighbor_sum(spins, i, j)
    if S < 0 || rand() < _Exp2β[S + 1]
        M[t] = M[t - 1] - 2spins[i,j]
        E[t] = E[t - 1] + 2S
        spins[i,j] = -spins[i,j]
    else
        M[t] = M[t - 1]
        E[t] = E[t - 1]
    end
    return nothing
end

metropolis_acceptance_probabilities(β::Real) = ntuple(x -> exp(-2β * (x - 1)), 5)