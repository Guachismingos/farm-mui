import { QrCodeScanner } from "@mui/icons-material";
import { Box, Button, Dialog, DialogContent } from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import React from "react";

const qrcodeRegionId = "html5qr-code-full-region";

class QrScanner extends React.Component {
  state = { hidden: true, open: false };

  qrCodeSuccessCallback = (decodedText) => {
    this.props.setSearchValue(decodedText);
    this.handleStopScan();
  };

  handleStopScan = () => {
    this.setState({ hidden: true });
    this.html5QrCode.stop().catch((err) => {
      console.error("Failed to clear html5QrcodeScanner. ", err);
    });
    this.setState({ open: false });
  };

  handleStartScan = () => {
    this.setState({ open: true });
    this.html5QrCode = new Html5Qrcode(qrcodeRegionId, { fps: 10 });
    if (this.state.hidden) {
      this.setState({ hidden: false });
      this.html5QrCode.start(
        { facingMode: "environment" },
        this.config,
        this.qrCodeSuccessCallback,
        this.props.qrCodeErrorCallback
      );
    } else {
      this.handleStopScan();
    }
  };

  render() {
    return (
      <Box height="100%">
        <Button
          variant="contained"
          color="secondary"
          fullWidth
          sx={{ height: "100%" }}
          onClick={this.handleStartScan}
        >
          <QrCodeScanner />
        </Button>
        <Dialog
          onClose={this.handleStopScan}
          open={this.state.open}
          keepMounted
        >
          <DialogContent sx={{ display: "contents" }}>
            <div id={qrcodeRegionId}></div>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }
}

export default QrScanner;
