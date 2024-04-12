# version is 13.7.2

# copy basic files
cp -R ../cypress/packages/driver/src/config src/_driver/src/
cp -R ../cypress/packages/driver/src/cy src/_driver/src/
cp -R ../cypress/packages/driver/src/cypress src/_driver/src/
cp -R ../cypress/packages/driver/src/dom src/_driver/src/
cp -R ../cypress/packages/driver/src/util src/_driver/src/

cp -R ../cypress/packages/driver/types/ src/_driver/types/

# copy patches to npm modules
cp -R ../cypress/packages/driver/patches/ ./patches
cp -R ../cypress/patches/ ./patches

# copy min requirements from other packages
cp ../cypress/packages/network/lib/cors.ts src/_driver/packages/network/lib
cp ../cypress/packages/network/lib/types.ts src/_driver/packages/network/lib
cp ../cypress/packages/network/lib/uri.ts src/_driver/packages/network/lib

cp ../cypress/packages/net-stubbing/lib/types.ts src/_driver/packages/net-stubbing/lib
cp ../cypress/packages/net-stubbing/lib/external-types.ts src/_driver/packages/net-stubbing/lib
cp ../cypress/packages/net-stubbing/lib/internal-types.ts src/_driver/packages/net-stubbing/lib
cp ../cypress/packages/net-stubbing/lib/util.ts src/_driver/packages/net-stubbing/lib

cp ../cypress/packages/errors/src/stackUtils.ts src/_driver/packages/errors/src
cp ../cypress/packages/errors/src/errorTypes.ts src/_driver/packages/errors/src


#edits:
#
#return chai.util.objDisplay = function (obj) {
#return chai.util.objDisplay = function (obj: {name: string, length: number}) {

#constructor (Cypress, cy) {
#    this.Cypress = Cypress
#    this.cy = cy
#  }
#constructor (_Cypress, cy) {
#    this.Cypress = _Cypress
#    this.cy = cy
#  }
