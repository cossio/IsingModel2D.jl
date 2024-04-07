import Pkg

Pkg.Registry.add(Pkg.RegistrySpec(url="https://github.com/cossio/CossioJuliaRegistry.git"))
Pkg.Registry.add("General")

# install some packages on global env
Pkg.activate()
Pkg.add([
    "MyRegistrator",
    "Revise",
])

# make sure project env is instantiated and updated
Pkg.activate(pwd())
Pkg.update()
