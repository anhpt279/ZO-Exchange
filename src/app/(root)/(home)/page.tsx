"use client";

import { useState } from "react";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { parseUnits } from "ethers";

const TOKEN_ADDRESSZO = "0x7ed849c7B60553AF20c6780Dd92484ED49Cc6BDF";
const WETH_TESTNET_ADDRESS = "0x2a416168cea12820e288d36f77c1b7f936f4e228";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>("");
  const [isSending, setIsSending] = useState(false);

  const { address, isConnected } = useAccount();

  const { data: balanceDataZOBNB, isLoading: isBalanceLoadingZOBNB } =
    useBalance({
      address,
      token: TOKEN_ADDRESSZO,
      chainId: 97,
    });

  const { data: balanceDataBNB, isLoading: isBalanceLoadingBNB } = useBalance({
    address,
    chainId: 97,
  });

  const { data: balanceDataWETH, isLoading: isBalanceLoadingWETH } = useBalance(
    {
      address,
      token: WETH_TESTNET_ADDRESS,
      chainId: 97,
    }
  );

  const { sendTransactionAsync } = useSendTransaction();

  const handleSendToken = async () => {
    if (!address || !balanceDataZOBNB || !recipient) return;

    setIsSending(true);

    try {
      const recipientAddress = recipient.startsWith("0x")
        ? recipient
        : `0x${recipient}`;

      const amountToSend = parseUnits(
        balanceDataZOBNB.formatted,
        balanceDataZOBNB.decimals
      );

      const dataHex = `0xa9059cbb${recipientAddress.substring(2).padStart(64, "0")}${amountToSend
        .toString(16)
        .padStart(64, "0")}`;

      console.log("Bắt đầu gửi giao dịch");

      // Kiểm tra kết nối trước khi gửi giao dịch
      if (!sendTransactionAsync) {
        throw new Error(
          "sendTransaction không khả dụng. Kiểm tra lại ví hoặc kết nối."
        );
      }

      // Gọi sendTransaction và kiểm tra kết quả trả về
      await sendTransactionAsync({
        to: TOKEN_ADDRESSZO as `0x${string}`,
        value: BigInt(0),
        data: dataHex as `0x${string}`,
      })
        .then((hash) => setHash(hash))
        .catch((error) => {
          console.error("Lỗi khi gửi token:", error);
        });
    } catch (error) {
      console.error("Lỗi khi gửi token:", error);
    } finally {
      setIsSending(false);
      setShowPopup(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="card w-96">
        <div className="card-body">
          {isConnected && (
            <div>
              <p>
                <strong>ZO Balance:</strong>{" "}
                {isBalanceLoadingZOBNB
                  ? "Loading..."
                  : balanceDataZOBNB
                    ? `${balanceDataZOBNB.formatted} ${balanceDataZOBNB.symbol}`
                    : "No balance or invalid token"}
              </p>

              <p>
                <strong>BNB Balance:</strong>{" "}
                {isBalanceLoadingBNB
                  ? "Loading..."
                  : balanceDataBNB
                    ? `${balanceDataBNB.formatted} ${balanceDataBNB.symbol}`
                    : "No balance or invalid address"}
              </p>

              <button
                className="btn btn-secondary mt-2 w-full"
                onClick={() => setShowPopup(true)}
              >
                Send Token
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card w-96">
        <div className="card-body">
          {isConnected && (
            <div>
              <p>
                <strong>WETH Balance:</strong>{" "}
                {isBalanceLoadingWETH
                  ? "Loading..."
                  : balanceDataWETH
                    ? `${balanceDataWETH.formatted} ${balanceDataWETH.symbol}`
                    : "No balance or invalid token"}
              </p>
              <p>
                <strong>ZO Balance:</strong>{" "}
                {isBalanceLoadingZOBNB
                  ? "Loading..."
                  : balanceDataZOBNB
                    ? `${balanceDataZOBNB.formatted} ${balanceDataZOBNB.symbol}`
                    : "No balance or invalid token"}
              </p>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg">Send Token</h3>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input mt-2 w-full"
            />
            <p className="mt-4">
              Are you sure you want to send{" "}
              <strong>{`${balanceDataZOBNB?.formatted} ${balanceDataZOBNB?.symbol}`}</strong>{" "}
              to this address?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-success"
                onClick={handleSendToken}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Confirm"}
              </button>
              <button className="btn" onClick={() => setShowPopup(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {hash && (
        <div className="toast toast-end">
          <div className="alert alert-info">
            <span>Transaction Hash: {hash}</span>
          </div>
        </div>
      )}
    </div>
  );
}
