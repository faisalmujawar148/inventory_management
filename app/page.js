'use client'
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '@/firebase';
import { Box, Button, IconButton, Modal, Stack, TextField, Typography, Grid } from "@mui/material";
import { collection, deleteDoc, getDocs, query, getDoc, setDoc, doc } from "firebase/firestore";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    mode: 'dark',  // Set the mode to 'dark' for dark mode
    primary: {
      main: '#1e1e1e', // Light blue color for primary
    },
    secondary: {
      main: '#f48fb1', // Light pink color for secondary
    },
    background: {
      default: '#121212',  // Dark background color
      
    },
    text: {
      primary: '#ffffff',  // White text color for primary text
      secondary: '#b0b0b0',  // Light grey text color for secondary text
    },
  },
});
theme = responsiveFontSizes(theme);

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Box 
        width="100vw" 
        height="100vh" 
        display="flex" 
        justifyContent="center" 
        flexDirection="column" 
        alignItems="center" 
        gap={2}
        sx={{ backgroundColor: 'background.default' }}  // Ensure the background is dark
      >
        <Modal open={open} onClose={handleClose}>
          <Box 
            position="absolute" 
            top="50%" 
            left="50%" 
            width={400} 
            bgcolor={"background.paper"} 
            border="2px solid #000" 
            boxShadow={24} 
            p={4} 
            display={"flex"} 
            flexDirection={"column"} 
            gap={3} 
            sx={{ transform: "translate(-50%, -50%)" }}
          >
            <Typography variant="h5" color={"text.primary"}>Add Item</Typography>
            <Stack width={"100%"} direction="row" spacing={2}>
              <TextField variant="outlined" fullWidth value={itemName} onChange={(e) => { setItemName(e.target.value) }}></TextField>
              <Button 
                variant="outlined" 
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              > 
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        
        <Box border={'1px solid #333'} width={"80vw"}>
          <Box 
            width="100%" 
            height="100px" 
            display={"flex"} 
            alignItems={"center"} 
            justifyContent={"center"} 
            bgcolor={"primary.main"}
          >
            <Typography variant="h2" color="text.primary">
              Inventory Items
            </Typography>
          </Box>
        
          <Stack width="100%" height="600px" spacing={2} overflow={"auto"}>
            {inventory.map(({ name, quantity }) => (
              <Grid 
                container 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display={"flex"} 
                alignItems={"center"} 
                justifyContent={"space-between"} 
                padding={5} 
                bgcolor={"background.paper"}
              >
                <Grid item xs={4} sx={{ whiteSpace: 'normal' }}>
                  <Typography variant="h3" color="text.primary" textAlign="center"> 
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ whiteSpace: 'normal' }}>
                  <Typography variant="h3" color="text.primary" textAlign="center"> 
                    {quantity}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Stack direction="column" spacing={1}>
                    <IconButton sx={{ color: "text.primary" }} variant="contained" onClick={() => { addItem(name) }}>
                      <AddIcon />
                    </IconButton>
                    <IconButton sx={{ color: "text.primary" }} variant="contained" onClick={() => { removeItem(name) }}>
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Box>
        <IconButton variant="contained" onClick={handleOpen}>
          <AddIcon fontSize="large"/>
        </IconButton>
      </Box>
    </ThemeProvider>
  );
}
