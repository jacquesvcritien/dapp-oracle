/**
 * @typedef {Object} DeployPowers The special powers that `agoric deploy` gives us
 * @property {(path: string) => { moduleFormat: string }} bundleSource
 * @property {(path: string) => string} pathResolve
 */

import { E } from '@agoric/far';

/**
 * @param {any} referencesPromise A promise for the references
 * available from REPL home
 * @param {DeployPowers} _powers
 */
export default async function deployShutdown(referencesPromise, _powers) {
  const { scratch, wallet, zoe } = await referencesPromise;

  console.log('Getting oracleCreator');
  /** @type {OracleCreatorFacet} */
  const creatorFacet = await E(scratch).get('oracleCreator');
  console.log('Shutting down contract.');

  const shutdownInvitation = E(creatorFacet).makeShutdownInvitation();
  const shutdownSeat = E(zoe).offer(shutdownInvitation);
  const payout = await E(shutdownSeat).getPayouts();
  console.log('Got payouts', payout);

  await Promise.all(
    Object.values(payout).map(payment => E(wallet).addPayment(payment)),
  );
  console.log('Payments deposited');
}
