'use client'
import Image from "next/image";
import { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { firestore } from '@/firebase';
import { Box, Button, IconButton, Modal, Stack, TextField, Typography, Grid } from "@mui/material";
import { collection, deleteDoc, getDocs, query, getDoc, setDoc, doc } from "firebase/firestore"; // Added 'doc' import
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';

let theme = createTheme();
theme = responsiveFontSizes(theme);

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState(''); // Changed to an empty string

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
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" flexDirection="column" alignItems="center" gap={2}>
        <Modal open={open} onClose={handleClose}>
          <Box position="absolute" top="50%" left="50%" width={400} bgcolor={"white"} border="2px solid #000" boxShadow={24} p={4} display={"flex"} flexDirection={"column"} gap={3} sx={{ transform: "translate(-50%, -50%)" }}>
            <Typography variant="h5" color={"black"}>Add Item</Typography>
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
          <Box width="100%" height="100px" display={"flex"} alignItems={"center"} justifyContent={"center"} bgcolor={"#333"}>
            <Typography variant="h2" color="#FFF">
              Inventory Items
            </Typography>
          </Box>
        
          <Stack width="100%" height="600px" spacing={2} overflow={"auto"}>
            {inventory.map(({ name, quantity }) => (
              <Grid container key={name} width="100%" minHeight="150px" display={"flex"} alignItems={"center"} justifyContent={"space-between"} padding={5} bgcolor={"#f0f0f0"}>
                <Grid item xs={4} sx={{ whiteSpace: 'normal' }}>
                  <Typography variant="h3" color="#333" textAlign="center"> 
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                </Grid>
                <Grid item xs={2} sx={{ whiteSpace: 'normal' }}>
                  <Typography variant="h3" color="#333" textAlign="center"> 
                    {quantity}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Stack direction="column" spacing={1}>
                    <IconButton sx={{ color: "#333" }} variant="contained" onClick={() => { addItem(name) }}>
                      <AddIcon />
                    </IconButton>
                    <IconButton sx={{ color: "#333" }} variant="contained" onClick={() => { removeItem(name) }}>
                      <RemoveIcon />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Box>
        <IconButton  sx={{ color: "#F0F0F0F0" }} variant="contained" onClick={handleOpen}>
          <AddIcon fontSize="large"/>
        </IconButton>
      </Box>
    </ThemeProvider>
  );
}
