// Reserve.tsx

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Box,
  useMediaQuery,
  useTheme,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Card,
  CardContent,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Update as UpdateIcon,
  AccountBalanceWallet as WalletIcon,
  Sync as SyncIcon,
  AttachMoney as AttachMoneyIcon,
  MoneyOff as MoneyOffIcon,
  Send as SendIcon,
  DeleteForever as DeleteForeverIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
  getContract,
  readContract,
  prepareContractCall,
  sendAndConfirmTransaction,
} from 'thirdweb';
import { useActiveAccount, useActiveWallet } from 'thirdweb/react';
import { base } from 'thirdweb/chains';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { ethers, formatEther, parseEther } from 'ethers';
import axios from 'axios';
import { diamondAddress } from '../primitives/Diamond';
// Import the thirdweb client from your server-side utility
import { getThirdwebClient } from '../src/utils/createThirdwebClient';

// Initialize the client from the server-side utility
const client = getThirdwebClient();

// Contract Address
const contractAddress = diamondAddress;

// ABI
const abi: any = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "subsidiaryAddress", "type": "address" }], "name": "BeneficiariesSynced", "type": "event" }, { "anonymous": false, "inputs": [], "name": "BeneficiariesWiped", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "beneficiaryAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "split", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "role", "type": "string" }], "name": "BeneficiaryAdded", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "beneficiaryAddress", "type": "address" }], "name": "BeneficiaryRemoved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "beneficiaryAddress", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "split", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "role", "type": "string" }], "name": "BeneficiaryUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "note", "type": "string" }], "name": "FundsDeposited", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "note", "type": "string" }], "name": "OneTimePaymentSent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newPercentage", "type": "uint256" }], "name": "ReserveWithdrawalPercentageUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "Withdrawal", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newInterval", "type": "uint256" }], "name": "WithdrawalIntervalUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "uint256", "name": "newLimit", "type": "uint256" }], "name": "WithdrawalLimitUpdated", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "beneficiaryAddress", "type": "address" }, { "internalType": "uint256", "name": "split", "type": "uint256" }, { "internalType": "string", "name": "role", "type": "string" }], "name": "addBeneficiary", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "note", "type": "string" }], "name": "depositFunds", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getBeneficiaries", "outputs": [{ "components": [{ "internalType": "address", "name": "beneficiaryAddress", "type": "address" }, { "internalType": "uint256", "name": "split", "type": "uint256" }, { "internalType": "string", "name": "role", "type": "string" }], "internalType": "struct TUCReserve.Beneficiary[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "removeBeneficiaryByIndex", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "percentage", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "string", "name": "note", "type": "string" }], "name": "sendOneTimePayment", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newPercentage", "type": "uint256" }], "name": "setReserveWithdrawalPercentage", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newInterval", "type": "uint256" }], "name": "setWithdrawalInterval", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "newLimit", "type": "uint256" }], "name": "setWithdrawalLimit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "beneficiaryAddress", "type": "address" }, { "internalType": "uint256", "name": "split", "type": "uint256" }, { "internalType": "string", "name": "role", "type": "string" }], "name": "updateBeneficiary", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "wipeBeneficiaries", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
{ "inputs": [{ "internalType": "string", "name": "role", "type": "string" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }
] as const;

// Role Definition
const CHIEF_OF_POLICE_ROLE = 'TheHighTable';

// MUI Theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#F54029',
    },
    secondary: {
      main: '#FFF',
    },
    background: {
      default: 'rgba(72, 72, 72, 0.5)',
      paper: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Styled Components
const MainContainer = styled(Box)(({ theme }) => ({
  height: '96vh',
  overflowY: 'auto',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  marginTop: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  backgroundColor: theme.palette.background.paper,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 8,
  textTransform: 'none',
  padding: theme.spacing(1.5, 3),
  color: theme.palette.text.primary,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const COLORS = ['#F54029', '#0F0', '#F0F', '#FF0', '#F00', '#00F', '#0F9', '#F90'];

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const { timestamp, balance, percentageChange } = data;

    return (
      <div
        style={{
          backgroundColor: '#222',
          padding: '10px',
          borderRadius: '8px',
          color: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 'bold' }}>{timestamp}</p>
        <p style={{ margin: '5px 0' }}>Balance: {balance} ETH</p>
        {percentageChange !== null && (
          <p
            style={{
              margin: 0,
              color: percentageChange >= 0 ? 'green' : 'red',
            }}
          >
            Change: {percentageChange.toFixed(2)}%
          </p>
        )}
      </div>
    );
  }

  return null;
};

// Reserve Component
const Reserve = () => {
  // State variables
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [transactionCount, setTransactionCount] = useState<number>(0);
  const [lastTransactions, setLastTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(true);
  const [isChief, setIsChief] = useState<boolean>(false);
  const [openAddBeneficiary, setOpenAddBeneficiary] = useState<boolean>(false);
  const [newBeneficiary, setNewBeneficiary] = useState<{ address: string; split: number; role: string }>({
    address: '',
    split: 0,
    role: '',
  });
  const [openUpdateBeneficiary, setOpenUpdateBeneficiary] = useState<boolean>(false);
  const [currentBeneficiary, setCurrentBeneficiary] = useState<{
    index: number;
    address: string;
    split: number;
    role: string;
  }>({ index: 0, address: '', split: 0, role: '' });

  // State variables for write functions
  const [openWriteFunctionDialog, setOpenWriteFunctionDialog] = useState<boolean>(false);
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [functionInputs, setFunctionInputs] = useState<any>({});

  // State variable for balance history
  const [balanceHistory, setBalanceHistory] = useState<any[]>([]);

  // API Key
  const apiKey = (() => {
    const apiKey = process.env.NEXT_PUBLIC_EXPLORER_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_EXPLORER_API_KEY environment variable is not set.');
    }
    return apiKey;
  })();

  // Active Account
  const address = useActiveAccount()?.address;

  // MUI Theme and Responsiveness
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  // Active Wallet
  const wallet = useActiveWallet()?.getAccount();

  // Effect Hook
  useEffect(() => {
    if (wallet) {
      checkIfChief();
      fetchAllData();
      fetchTransactionData();
      // Removed fetchBalance() since balance is handled in processBalanceHistory
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet]);

  // Fetch Beneficiaries
  const fetchAllData = async () => {
    try {
      const contract = getContract({
        client,
        chain: base,
        address: contractAddress,
        abi: abi,
      });

      // Fetch Beneficiaries
      const beneficiariesData = await readContract({
        contract,
        method: 'getBeneficiaries',
        params: [],
      });
      setBeneficiaries(beneficiariesData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching contract data:', error);
      setLoading(false);
    }
  };

  // Check if User is Chief
  const checkIfChief = async () => {
    try {
      const contract = getContract({
        client,
        chain: base,
        address: contractAddress,
        abi: abi,
      });

      const hasRole = await readContract({
        contract,
        method: 'hasRole',
        params: [CHIEF_OF_POLICE_ROLE, address],
      });

      setIsChief(hasRole as boolean);
    } catch (error) {
      console.error('Error checking role:', error);
    }
  };

  // Fetch Transactions (External and Internal)
  const fetchTransactionData = async () => {
    try {
      // Fetch External Transactions
      const externalTxResponse = await axios.get(
        `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlist&address=${contractAddress}&sort=asc&apikey=${apiKey}`
      );

      // Fetch Internal Transactions
      const internalTxResponse = await axios.get(
        `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=txlistinternal&address=${contractAddress}&sort=asc&apikey=${apiKey}`
      );

      const externalData = externalTxResponse.data;
      const internalData = internalTxResponse.data;

      if (externalData.status !== '1') {
        console.error('Error fetching external transactions:', externalData.message);
        return;
      }

      if (internalData.status !== '1') {
        console.error('Error fetching internal transactions:', internalData.message);
        return;
      }

      // Combine both transaction lists
      const combinedTransactions = [...externalData.result, ...internalData.result];

      // Sort transactions by timestamp in ascending order
      combinedTransactions.sort((a, b) => Number(a.timeStamp) - Number(b.timeStamp));

      const txCount = combinedTransactions.length;
      setTransactionCount(txCount);

      const lastTransactions = combinedTransactions.slice(-4).reverse();
      setLastTransactions(lastTransactions);

      // Process transactions to calculate balance history
      await processBalanceHistory(combinedTransactions); // Ensure processBalanceHistory is async
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    }
  };

  // Process Balance History
  const processBalanceHistory = async (transactions: any[]) => {
    try {
      // Initialize balance at zero
      let balance = 0n; // BigInt starting at 0

      const balanceHistoryData: any[] = [];

      // Ensure transactions are sorted in ascending order
      const sortedTransactions = transactions.sort(
        (a, b) => Number(a.timeStamp) - Number(b.timeStamp)
      );

      const contractAddressLower = contractAddress.toLowerCase();

      let previousBalance = 0n; // To store the previous balance for percentage change

      sortedTransactions.forEach((txn) => {
        const value = BigInt(txn.value || '0'); // Transaction value in wei
        const timestamp = Number(txn.timeStamp) * 1000; // Convert to milliseconds

        const txnToLower = (txn.to || '').toLowerCase();
        const txnFromLower = (txn.from || '').toLowerCase();

        if (txnToLower === contractAddressLower) {
          // Incoming transaction (Deposit)
          balance += value;
        } else if (txnFromLower === contractAddressLower) {
          // Outgoing transaction (Withdrawal)
          balance -= value;

          // Prevent balance from going negative (optional safeguard)
          if (balance < 0n) {
            console.warn('Balance went negative. Adjusting to 0.');
            balance = 0n;
          }
        }

        // Calculate percentage change
        let percentageChange: number | null = null;
        if (previousBalance !== 0n) {
          percentageChange =
            Number(balance - previousBalance) / Number(previousBalance) * 100;
        }

        balanceHistoryData.push({
          timestamp: new Date(timestamp).toLocaleDateString(),
          balance: Number(formatEther(balance.toString())), // Convert balance to Ether format
          percentageChange, // Percentage change from previous balance
        });

        // Update previous balance
        previousBalance = balance;

        // Debugging: Log each balance update
        console.log(
          `After txn ${txn.hash}: Balance = ${formatEther(
            balance.toString()
          )} ETH, Change = ${percentageChange !== null ? percentageChange.toFixed(2) + '%' : 'N/A'
          }`
        );
      });

      // Fetch the current balance of the contract to verify accuracy
      const balanceResponse = await axios.get(
        `https://api.etherscan.io/v2/api?chainid=8453&module=account&action=balance&address=${contractAddress}&tag=latest&apikey=${apiKey}`
      );
      const balanceData = balanceResponse.data;

      if (balanceData.status === '1') {
        const currentBalance = BigInt(balanceData.result);
        const calculatedBalance = balance;

        if (currentBalance !== calculatedBalance) {
          console.warn(
            `Discrepancy detected! Calculated Balance: ${formatEther(
              calculatedBalance.toString()
            )} ETH, Actual Balance: ${formatEther(
              currentBalance.toString()
            )} ETH`
          );
        } else {
          console.log(
            `Balance verification successful: ${formatEther(
              calculatedBalance.toString()
            )} ETH`
          );
        }
      } else {
        console.error('Error fetching balance:', balanceData.message);
      }

      setBalanceHistory(balanceHistoryData);

      // Update the displayed balance to match the calculated balance
      setBalance(formatEther(balance.toString()));
    } catch (error) {
      console.error('Error processing balance history:', error);
    }
  };

  // Handle Add Beneficiary
  const handleAddBeneficiary = async () => {
    if (!newBeneficiary.address || newBeneficiary.split <= 0 || !newBeneficiary.role) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      if (!wallet) {
        alert('Wallet not connected.');
        return;
      }

      const contract = getContract({
        client,
        chain: base,
        address: contractAddress,
        abi: abi,
      });

      const tx = await prepareContractCall({
        contract,
        method: 'addBeneficiary',
        params: [newBeneficiary.address, newBeneficiary.split, newBeneficiary.role],
      });

      await sendAndConfirmTransaction({
        transaction: tx,
        account: wallet,
      });

      alert('Beneficiary added successfully!');
      setOpenAddBeneficiary(false);
      setNewBeneficiary({ address: '', split: 0, role: '' });
      fetchAllData();
      fetchTransactionData(); // Refresh transactions
    } catch (error) {
      console.error('Error adding beneficiary:', error);
      alert('Failed to add beneficiary.');
    }
  };

  // Handle Update Beneficiary
  const handleUpdateBeneficiary = async () => {
    if (!currentBeneficiary.address || currentBeneficiary.split <= 0 || !currentBeneficiary.role) {
      alert('Please fill all fields correctly.');
      return;
    }

    try {
      if (!wallet) {
        alert('Wallet not connected.');
        return;
      }

      const contract = getContract({
        client,
        chain: base,
        address: contractAddress,
        abi: abi,
      });

      const tx = await prepareContractCall({
        contract,
        method: 'updateBeneficiary',
        params: [currentBeneficiary.address, currentBeneficiary.split, currentBeneficiary.role],
      });

      await sendAndConfirmTransaction({
        transaction: tx,
        account: wallet,
      });

      alert('Beneficiary updated successfully!');
      setOpenUpdateBeneficiary(false);
      setCurrentBeneficiary({ index: 0, address: '', split: 0, role: '' });
      fetchAllData();
      fetchTransactionData(); // Refresh transactions
    } catch (error) {
      console.error('Error updating beneficiary:', error);
      alert('Failed to update beneficiary.');
    }
  };

  // Handle Remove Beneficiary
  const handleRemoveBeneficiary = async (index: number) => {
    if (!window.confirm('Are you sure you want to remove this beneficiary?')) return;

    try {
      if (!wallet) {
        alert('Wallet not connected.');
        return;
      }

      const contract = getContract({
        client,
        chain: base,
        address: contractAddress,
        abi: abi,
      });

      const tx = await prepareContractCall({
        contract,
        method: 'removeBeneficiaryByIndex',
        params: [index],
      });

      await sendAndConfirmTransaction({
        transaction: tx,
        account: wallet,
      });

      alert('Beneficiary removed successfully!');
      fetchAllData();
      fetchTransactionData(); // Refresh transactions
    } catch (error) {
      console.error('Error removing beneficiary:', error);
      alert('Failed to remove beneficiary.');
    }
  };

  // Handle Write Functions
  const handleWriteFunction = async () => {
    try {
      if (!wallet) {
        alert('Wallet not connected.');
        return;
      }

      const contract = getContract({
        client,
        chain: base,
        address: contractAddress,
        abi: abi,
      });

      let tx;

      switch (selectedFunction) {
        case 'depositFunds':
          if (!functionInputs.amount || !functionInputs.note) {
            alert('Please provide both amount and note.');
            return;
          }
          tx = await prepareContractCall({
            contract,
            method: 'depositFunds',
            params: [functionInputs.note],
            value: parseEther(functionInputs.amount),
          });
          break;
        case 'withdraw':
          tx = await prepareContractCall({
            contract,
            method: 'withdraw',
            params: [],
          });
          break;
        case 'sendOneTimePayment':
          if (!functionInputs.percentage || !functionInputs.address || !functionInputs.note) {
            alert('Please provide both percentage and note.');
            return;
          }
          tx = await prepareContractCall({
            contract,
            method: 'sendOneTimePayment',
            params: [Number(functionInputs.percentage), functionInputs.address, functionInputs.note],
          });
          break;
        // case 'updateAndSyncBeneficiaries':
        //   tx = await prepareContractCall({
        //     contract,
        //     method: 'updateAndSyncBeneficiaries',
        //     params: [],
        //   });
        //   break;
        case 'wipeBeneficiaries':
          tx = await prepareContractCall({
            contract,
            method: 'wipeBeneficiaries',
            params: [],
          });
          break;
        // Add cases for other write functions as needed
        default:
          alert('Function not implemented.');
          return;
      }

      await sendAndConfirmTransaction({
        transaction: tx,
        account: wallet,
      });

      alert(`${selectedFunction} executed successfully!`);
      setOpenWriteFunctionDialog(false);
      setFunctionInputs({});
      fetchAllData();
      fetchTransactionData(); // Refresh transactions
    } catch (error) {
      console.error(`Error executing ${selectedFunction}:`, error);
      alert(`Failed to execute ${selectedFunction}.`);
    }
  };

  // Render Beneficiaries Chart
  const renderBeneficiariesChart = () => {
    if (!beneficiaries || beneficiaries.length === 0) return null;

    const data = beneficiaries.map((b: any) => ({
      name: b.role,
      value: Number(b.split),
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#121212" />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  // Render Transactions Table
  const renderTransactionsTable = () => {
    if (!lastTransactions || lastTransactions.length === 0) return null;

    return (
      <TableContainer sx={{ mt: 2 }}>
        <Table aria-label="last transactions">
          <TableHead>
            <TableRow>
              <StyledTableCell>Txn Hash</StyledTableCell>
              <StyledTableCell>From</StyledTableCell>
              <StyledTableCell>To</StyledTableCell>
              <StyledTableCell>Amount (ETH)</StyledTableCell>
              <StyledTableCell>Timestamp</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lastTransactions.map((txn, index) => (
              <TableRow key={index}>
                <StyledTableCell>
                  <a
                    href={`https://basescan.org/tx/${txn.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                  >
                    {txn.hash.substring(0, 10)}...
                  </a>
                </StyledTableCell>
                <StyledTableCell>
                  <a
                    href={`https://basescan.org/address/${txn.from}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                  >
                    {txn.from.substring(0, 10)}...
                  </a>
                </StyledTableCell>
                <StyledTableCell>
                  <a
                    href={`https://basescan.org/address/${txn.to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: theme.palette.primary.main, textDecoration: 'none' }}
                  >
                    {txn.to.substring(0, 10)}...
                  </a>
                </StyledTableCell>
                <StyledTableCell>{formatEther(txn.value || '0')} ETH</StyledTableCell>
                <StyledTableCell>{new Date(txn.timeStamp * 1000).toLocaleString()}</StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render Balance Over Time Chart
  const renderBalanceHistoryChart = () => {
    if (!balanceHistory || balanceHistory.length === 0) return null;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={balanceHistory}
          margin={{ top: 20, right: 20, bottom: -20, left: -40 }} // Even padding
        >
          {/* Define the glow filter */}
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Remove grid by omitting CartesianGrid */}

          {/* X Axis without ticks and labels */}
          <XAxis
            dataKey="timestamp"
            tick={false}
            axisLine={false}
          />

          {/* Y Axis without ticks and labels */}
          <YAxis
            tick={false}
            axisLine={false}
          />

          {/* Custom Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Line with customized dots and glow effect */}
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#F54029" // Line color
            strokeWidth={3}
            dot={{ r: 4, fill: '#F54029', stroke: 'none' }} // Dots match the line color
            activeDot={{ r: 6, fill: '#F54029', stroke: 'none' }}
            filter="url(#glow)" // Apply glow filter
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Loading State
  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <MainContainer>
          <StyledContainer>
            <CircularProgress color="primary" />
            <StyledTypography variant="h6" sx={{ mt: 2 }}>
              Loading Reserve Dashboard...
            </StyledTypography>
          </StyledContainer>
        </MainContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <MainContainer>
        <StyledContainer>
          <StyledTypography variant={isMobile ? 'h2' : 'h2'} paddingTop={isMobile ? '100px' : '30px'}>
            Reserve Dashboard
          </StyledTypography>

          {/* Transaction Count and Balance */}
          <Grid container spacing={4} sx={{ maxWidth: 1200, mt: 2 }}>
            {balance !== '0' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <WalletIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                      <Box>
                        <StyledTypography variant="h6">Contract Balance</StyledTypography>
                        <StyledTypography variant="h4">{balance} ETH</StyledTypography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
            {transactionCount > 0 && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    height: '100%',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <SyncIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                      <Box>
                        <StyledTypography variant="h6">Transaction Count</StyledTypography>
                        <StyledTypography variant="h4">{transactionCount}</StyledTypography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          {/* Balance History Chart */}
          {balanceHistory && balanceHistory.length > 0 && (
            <StyledCard>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TimelineIcon color="primary" fontSize="large" sx={{ mr: 2 }} />
                  <StyledTypography variant="h5">Balance Over Time</StyledTypography>
                </Box>
                {renderBalanceHistoryChart()}
              </CardContent>
            </StyledCard>
          )}

          {/* Recent Transactions */}
          {lastTransactions && lastTransactions.length > 0 && (
            <StyledCard>
              <CardContent>
                <StyledTypography variant="h5" gutterBottom>
                  Recent Transactions
                </StyledTypography>
                {renderTransactionsTable()}
              </CardContent>
            </StyledCard>
          )}

          {/* Beneficiaries Section */}
          {beneficiaries && beneficiaries.length > 0 && (
            <StyledCard>
              <CardContent>
                <StyledTypography variant="h5" gutterBottom>
                  Beneficiaries
                </StyledTypography>
                {renderBeneficiariesChart()}
                {isChief && (
                  <Box
                    mt={2}
                    display="flex"
                    flexDirection={isMobile ? 'column' : 'row'}
                    justifyContent="flex-end"
                    gap={2}
                  >
                    <StyledButton
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAddBeneficiary(true)}
                      color="primary"
                    >
                      Add Beneficiary
                    </StyledButton>
                    <StyledButton
                      variant="contained"
                      startIcon={<UpdateIcon />}
                      //   onClick={() => {
                      //     setSelectedFunction('updateAndSyncBeneficiaries');
                      //     setOpenWriteFunctionDialog(true);
                      //   }}
                      color="primary"
                    >
                      Sync Beneficiaries
                    </StyledButton>
                  </Box>
                )}
                <Box mt={2}>
                  {beneficiaries.map((beneficiary, index) => (
                    <Paper
                      key={index}
                      elevation={1}
                      sx={{
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        mb: 2,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}
                    >
                      <Box>
                        <StyledTypography variant="body1">
                          <strong>Address:</strong> {beneficiary.beneficiaryAddress}
                        </StyledTypography>
                        <StyledTypography variant="body1">
                          <strong>Split:</strong> {beneficiary.split}%
                        </StyledTypography>
                        <StyledTypography variant="body1">
                          <strong>Role:</strong> {beneficiary.role}
                        </StyledTypography>
                      </Box>
                      {isChief && (
                        <Box mt={isMobile ? 2 : 0}>
                          <StyledButton
                            variant="outlined"
                            startIcon={<UpdateIcon />}
                            onClick={() => {
                              setCurrentBeneficiary({
                                index,
                                address: beneficiary.beneficiaryAddress,
                                split: beneficiary.split,
                                role: beneficiary.role,
                              });
                              setOpenUpdateBeneficiary(true);
                            }}
                            sx={{ mr: isMobile ? 0 : 1, mb: isMobile ? 1 : 0 }}
                          >
                            Update
                          </StyledButton>
                          <StyledButton
                            variant="contained"
                            color="error"
                            startIcon={<RemoveIcon />}
                            onClick={() => handleRemoveBeneficiary(index)}
                          >
                            Remove
                          </StyledButton>
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Box>
              </CardContent>
            </StyledCard>
          )}

          {/* Write Functions Section */}
          {isChief && (
            <StyledCard>
              <CardContent>
                <StyledTypography variant="h5" gutterBottom>
                  Administrative Actions
                </StyledTypography>

                {/* Fund Management Section */}
                <StyledTypography variant="h6" gutterBottom>
                  Fund Management
                </StyledTypography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <StyledButton
                      variant="contained"
                      startIcon={<AttachMoneyIcon />}
                      onClick={() => {
                        setSelectedFunction('depositFunds');
                        setOpenWriteFunctionDialog(true);
                      }}
                      fullWidth
                    >
                      Deposit Funds
                    </StyledButton>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <StyledButton
                      variant="contained"
                      startIcon={<MoneyOffIcon />}
                      onClick={() => {
                        setSelectedFunction('withdraw');
                        setOpenWriteFunctionDialog(true);
                      }}
                      fullWidth
                    >
                      Withdraw Funds
                    </StyledButton>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <StyledButton
                      variant="contained"
                      startIcon={<SendIcon />}
                      onClick={() => {
                        setSelectedFunction('sendOneTimePayment');
                        setOpenWriteFunctionDialog(true);
                      }}
                      fullWidth
                    >
                      Send One Time Payment
                    </StyledButton>
                  </Grid>
                </Grid>

                {/* Beneficiary Management Section */}
                <StyledTypography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Beneficiary Management
                </StyledTypography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <StyledButton
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAddBeneficiary(true)}
                      fullWidth
                      color="primary"
                    >
                      Add Beneficiary
                    </StyledButton>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <StyledButton
                      variant="contained"
                      //   startIcon={<SyncIcon />}
                      //   onClick={() => {
                      //     setSelectedFunction('updateAndSyncBeneficiaries');
                      //     setOpenWriteFunctionDialog(true);
                      //   }}
                      fullWidth
                      color="warning"
                    >
                      Welcome to the Reserve
                    </StyledButton>
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <StyledButton
                      variant="contained"
                      startIcon={<DeleteForeverIcon />}
                      onClick={() => {
                        setSelectedFunction('wipeBeneficiaries');
                        handleWriteFunction();
                      }}
                      fullWidth
                      color="error"
                    >
                      Wipe Beneficiaries
                    </StyledButton>
                  </Grid>
                </Grid>
              </CardContent>
            </StyledCard>
          )}

          {/* Add Beneficiary Dialog */}
          <Dialog
            open={openAddBeneficiary}
            onClose={() => setOpenAddBeneficiary(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              style: {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <DialogTitle>Add New Beneficiary</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Beneficiary Address"
                type="text"
                fullWidth
                variant="outlined"
                value={newBeneficiary.address}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, address: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Split (%)"
                type="number"
                fullWidth
                variant="outlined"
                value={newBeneficiary.split}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, split: Number(e.target.value) })}
              />
              <TextField
                margin="dense"
                label="Role"
                type="text"
                fullWidth
                variant="outlined"
                value={newBeneficiary.role}
                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, role: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddBeneficiary(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddBeneficiary} variant="contained" color="primary">
                Add
              </Button>
            </DialogActions>
          </Dialog>

          {/* Update Beneficiary Dialog */}
          <Dialog
            open={openUpdateBeneficiary}
            onClose={() => setOpenUpdateBeneficiary(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              style: {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <DialogTitle>Update Beneficiary</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Beneficiary Address"
                type="text"
                fullWidth
                variant="outlined"
                value={currentBeneficiary.address}
                onChange={(e) => setCurrentBeneficiary({ ...currentBeneficiary, address: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Split (%)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentBeneficiary.split}
                onChange={(e) => setCurrentBeneficiary({ ...currentBeneficiary, split: Number(e.target.value) })}
              />
              <TextField
                margin="dense"
                label="Role"
                type="text"
                fullWidth
                variant="outlined"
                value={currentBeneficiary.role}
                onChange={(e) => setCurrentBeneficiary({ ...currentBeneficiary, role: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenUpdateBeneficiary(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleUpdateBeneficiary} variant="contained" color="primary">
                Update
              </Button>
            </DialogActions>
          </Dialog>

          {/* Write Function Dialog */}
          <Dialog
            open={openWriteFunctionDialog}
            onClose={() => setOpenWriteFunctionDialog(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{
              style: {
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            }}
          >
            <DialogTitle>{`Execute ${selectedFunction}`}</DialogTitle>
            <DialogContent>
              {selectedFunction === 'depositFunds' && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Amount (ETH)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={functionInputs.amount || ''}
                    onChange={(e) => setFunctionInputs({ ...functionInputs, amount: e.target.value })}
                  />
                  <TextField
                    margin="dense"
                    label="Note"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={functionInputs.note || ''}
                    onChange={(e) => setFunctionInputs({ ...functionInputs, note: e.target.value })}
                  />
                </>
              )}
              {selectedFunction === 'sendOneTimePayment' && (
                <>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Percentage (%)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={functionInputs.percentage || ''}
                    onChange={(e) => setFunctionInputs({ ...functionInputs, percentage: e.target.value })}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Address"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={functionInputs.address || ''}
                    onChange={(e) => setFunctionInputs({ ...functionInputs, address: e.target.value })}
                  />
                  <TextField
                    margin="dense"
                    label="Note"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={functionInputs.note || ''}
                    onChange={(e) => setFunctionInputs({ ...functionInputs, note: e.target.value })}
                  />
                </>
              )}
              {/* Add input fields for other functions as needed */}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenWriteFunctionDialog(false)} color="secondary">
                Cancel
              </Button>
              <Button onClick={handleWriteFunction} variant="contained" color="primary">
                Execute
              </Button>
            </DialogActions>
          </Dialog>
        </StyledContainer>
      </MainContainer>
    </ThemeProvider>
  );
};

export default Reserve;
