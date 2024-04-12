
# copy basic files
cp -R ../cypress/packages/driver/src/ src/_driver/src/
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

# delete unneeded
rm src/_driver/src/cypress/cookies.ts


edits:

return chai.util.objDisplay = function (obj) {
return chai.util.objDisplay = function (obj: {name: string, length: number}) {