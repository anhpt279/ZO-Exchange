"use client";

import { useState } from "react";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { parseEther } from "ethers";
import sendHash from ".";
// import { useSendHash } from ".";

const TOKEN_ADDRESSZO = process.env
  .NEXT_PUBLIC_TOKEN_ADDRESSZO as `0x${string}`;
const WETH_TESTNET_ADDRESS = process.env
  .NEXT_PUBLIC_WETH_TESTNET_ADDRESS as `0x${string}`;
const ZOARB_TESTNET_ADDRESS = process.env
  .NEXT_PUBLIC_ZOARB_TESTNET_ADDRESS as `0x${string}`;

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [recipient, setRecipient] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  // const { trigger } = useSendHash();

  const { address, isConnected } = useAccount();

  const {
    data: balanceDataZOBNB,
    isLoading: isBalanceLoadingZOBNB,
    refetch: refetchZOBNB,
  } = useBalance({
    address,
    token: TOKEN_ADDRESSZO,
    chainId: 97,

    query: {
      // refetchInterval: 3000,
    },
  });

  const {
    data: balanceDataBNB,
    isLoading: isBalanceLoadingBNB,
    refetch: refetchBNB,
  } = useBalance({
    address,
    chainId: 97,

    query: {
      // refetchInterval: 3000,
    },
  });

  const {
    data: balanceDataWETH,
    isLoading: isBalanceLoadingWETH,

    refetch: refetchWETH,
  } = useBalance({
    address,
    token: WETH_TESTNET_ADDRESS,
    chainId: 97,
    query: {
      // refetchInterval: 3000,
    },
  });

  const {
    data: balanceDataZOARB,
    isLoading: isBalanceLoadingZOARB,
    refetch: refetchZOARB,
  } = useBalance({
    address,
    token: ZOARB_TESTNET_ADDRESS,
    chainId: 421614,
    query: {
      // refetchInterval: 3000,
    },
  });

  const { sendTransactionAsync } = useSendTransaction();

  const handleSendToken = async () => {
    if (!address || !balanceDataZOBNB || !recipient) return;

    setIsSending(true);

    try {
      const recipientAddress = recipient.startsWith("0x")
        ? recipient
        : `0x${recipient}`;

      const amountToSend = parseEther("10");

      const dataHex = `0xa9059cbb${recipientAddress.substring(2).padStart(64, "0")}${amountToSend
        .toString(16)
        .padStart(64, "0")}`;

      if (!sendTransactionAsync) {
        throw new Error(
          "sendTransaction không khả dụng. Kiểm tra lại ví hoặc kết nối."
        );
      }

      // Gửi giao dịch & lấy hash
      const hash = await sendTransactionAsync({
        to: TOKEN_ADDRESSZO as `0x${string}`,
        value: BigInt(0),
        data: dataHex as `0x${string}`,
      });
      setHash(hash);
      await sendHash(hash).then(() => {
        refetchZOBNB();
        refetchBNB();
        refetchWETH();
        refetchZOARB();
      });
    } catch (error) {
      console.error("Lỗi khi gửi token:", error);
    } finally {
      setIsSending(false);
      setShowPopup(false);
    }
  };

  return (
    <div className="mt-10 flex w-full items-center justify-center gap-10">
      <div
        className="card w-96 text-white"
        style={{
          background:
            "linear-gradient(180deg, rgba(67, 146, 219, 0.60) 0%, rgba(21, 56, 111, 0.60) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="card-body font-medium">
          {isConnected && (
            <div>
              <p>
                ZO Balance:{" "}
                {isBalanceLoadingZOBNB
                  ? "Loading..."
                  : balanceDataZOBNB
                    ? `${balanceDataZOBNB.formatted} ${balanceDataZOBNB.symbol}`
                    : "No balance or invalid token"}
              </p>

              <p>
                BNB Balance:{" "}
                {isBalanceLoadingBNB
                  ? "Loading..."
                  : balanceDataBNB
                    ? `${balanceDataBNB.formatted} ${balanceDataBNB.symbol}`
                    : "No balance or invalid address"}
              </p>

              <button
                className="btn btn-primary mt-2 w-full font-black"
                onClick={() => setShowPopup(true)}
              >
                Swap Token
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        className="card w-96 text-white"
        style={{
          background:
            "linear-gradient(180deg, rgba(67, 146, 219, 0.60) 0%, rgba(21, 56, 111, 0.60) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="card-body">
          {isConnected && (
            <div>
              <p>
                WETH Balance:{" "}
                {isBalanceLoadingWETH
                  ? "Loading..."
                  : balanceDataWETH
                    ? `${balanceDataWETH.formatted} ${balanceDataWETH.symbol}`
                    : "No balance or invalid token"}
              </p>
              <p>
                ZO Balance:{" "}
                {isBalanceLoadingZOARB
                  ? "Loading..."
                  : balanceDataZOARB
                    ? `${balanceDataZOARB.formatted} ${balanceDataZOARB.symbol}`
                    : "No balance or invalid token"}
              </p>
            </div>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-2xl font-black">Swap Token</h3>
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="input mt-2 w-full"
            />
            <p className="mt-4">
              Are you sure you want to swap{" "}
              {`${balanceDataZOBNB?.formatted} ${balanceDataZOBNB?.symbol}`}?
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
