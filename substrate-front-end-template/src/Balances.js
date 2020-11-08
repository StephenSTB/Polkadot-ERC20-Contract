import React, { useEffect, useState } from 'react';
import { Table, Grid, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSubstrate } from './substrate-lib';
import ERC20Contract from './ERC20Contract';


export default function Main (props) {
  const { api, keyring } = useSubstrate();
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState({});

  const contract = ERC20Contract(api);

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address);
    let unsubscribeAll = null;

    
    const getBalanceOf = async (account) => {
      const balance = await contract.query.balanceOf(account, 0, -1, account);
      return balance;
    };

    const getBalances = async () => {
      var i = 0;
      var aBalance = {};
      for(i; i < addresses.length; i++){
        aBalance[addresses[i]] = await (await getBalanceOf(addresses[i])).output.toHuman();
      }
      setBalances(aBalance);
    }

    getBalances();

    /*
    api.query.system.account
      .multi(addresses, balances => {
        const balancesMap = addresses.reduce((acc, address, index) => ({
          ...acc, [address]: balances[index].data.free.toHuman()
        }), {});
        setBalances(balancesMap);
      }).then(unsub => {
        unsubscribeAll = unsub;
      }).catch(console.error);*/

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, keyring, setBalances, contract]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      <Table celled striped size='small'>
        <Table.Body>{accounts.map(account =>
          <Table.Row key={account.address}>
            <Table.Cell width={3} textAlign='right'>{account.meta.name}</Table.Cell>
            <Table.Cell width={10}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {account.address}
              </span>
              <CopyToClipboard text={account.address}>
                <Button
                  basic
                  circular
                  compact
                  size='mini'
                  color='blue'
                  icon='copy outline'
                />
              </CopyToClipboard>
            </Table.Cell>
            <Table.Cell width={3}>{
              balances[account.address] 
            }</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
