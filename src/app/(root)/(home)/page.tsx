"use client";

import { useEffect, useState } from "react";
import { useAccount, useBalance, useSendTransaction } from "wagmi";
import { parseEther } from "ethers";
import sendHash from "../(home)";
import BSC from "../../../../public/assets/icons/ic_bsc.svg";
import ZO from "../../../../public/assets/icons/ic_zo.svg";
import ARB from "../../../../public/assets/icons/ic_arb.svg";
import Swap from "../../../../public/assets/icons/transfer.svg";
import Info from "../../../../public/assets/icons/ic_info.svg";
import Image from "next/image";

const tokenAddressZoBsc = process.env
  .NEXT_PUBLIC_ZO_BSC_ADDRESS as `0x${string}`;

const ZoArBAddress = process.env.NEXT_PUBLIC_ZO_ARB_ADDRESS as `0x${string}`;

const targetAddress = process.env
  .NEXT_PUBLIC_ZO_BSC_TARGET_ADDRESS as `0x${string}`;

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [valueInPut, setValueInput] = useState<number>();

  const { address } = useAccount();

  const {
    data: balanceDataZOBNB,
    isLoading: isBalanceLoadingZOBNB,
    refetch: refetchZOBNB,
  } = useBalance({
    address,
    token: tokenAddressZoBsc,
    chainId: 56,
  });

  const {
    data: balanceDataBNB,
    isLoading: isBalanceLoadingBNB,
    refetch: refetchBNB,
  } = useBalance({
    address,
    chainId: 56,
  });

  const {
    data: balanceDataZOARB,
    isLoading: isBalanceLoadingZOARB,
    refetch: refetchZOARB,
  } = useBalance({
    address,
    token: ZoArBAddress,
    chainId: 42161,
  });

  const { sendTransactionAsync } = useSendTransaction();

  const handleSendToken = async () => {
    if (!address || !balanceDataZOBNB) return;
    setIsSending(true);
    try {
      const recipientAddress = targetAddress;

      const amountToSend = parseEther("10");

      const dataHex = `0xa9059cbb${recipientAddress.substring(2).padStart(64, "0")}${amountToSend
        .toString(16)
        .padStart(64, "0")}`;

      if (!sendTransactionAsync) {
        throw new Error(
          "sendTransaction không khả dụng. Kiểm tra lại ví hoặc kết nối."
        );
      }

      const hash = await sendTransactionAsync({
        to: tokenAddressZoBsc as `0x${string}`,
        value: BigInt(0),
        data: dataHex as `0x${string}`,
      });
      setHash(hash);
      await sendHash(hash).then(() => {
        refetchZOBNB();
        refetchBNB();
        refetchZOARB();
      });
    } catch (error) {
      console.error("Lỗi khi gửi token:", error);
    } finally {
      setIsSending(false);
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (balanceDataZOBNB && Number(balanceDataZOBNB.formatted) > 0) {
      setValueInput(Number(balanceDataZOBNB.formatted));
    }
  }, [balanceDataZOBNB]);

  if (address) {
    return (
      <div
        className="relative mx-auto mt-[10vh] w-[85vw] mb-7 rounded-[20px] p-6 shadow-md sm:w-[358px] sm:px-6 sm:pb-14 sm:pt-6 lg:w-[628px] lg:p-20"
        style={{
          background: "rgba(26, 27, 49, 0.85)",
        }}
      >
        <div className="absolute left-0 top-0 size-[80px] rotate-180 rounded-lg bg-[#A3FF12] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_95%,95%_95%,95%_0)]"></div>
        <div className="absolute right-0 top-0 size-[80px] -rotate-90 rounded-lg bg-[#A3FF12] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_95%,95%_95%,95%_0)]"></div>
        <div className="absolute bottom-0 left-0 size-[80px] rotate-90 rounded-lg bg-[#A3FF12] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_95%,95%_95%,95%_0)]"></div>
        <div className="absolute bottom-0 right-0 size-[80px]  rounded-lg bg-[#A3FF12] [clip-path:polygon(0_0,100%_0,100%_100%,0_100%,0_95%,95%_95%,95%_0)]"></div>

        <p className="mb-3 text-base font-normal text-white">Swap token</p>
        <div className="relative mb-4 flex flex-col gap-2">
          <div
            className="flex flex-col gap-4 rounded-lg px-4 pb-7 pt-4"
            style={{
              background:
                "linear-gradient(181deg, rgba(40, 60, 94, 0.95) 7.43%, rgba(43, 66, 132, 0.95) 93.92%)",
            }}
          >
            <div className="flex items-center justify-between text-white">
              <p className="text-sm font-medium">You send</p>
              <div
                className="flex items-center gap-2 rounded-full px-2 py-1 text-xs font-normal"
                style={{
                  background: "rgba(0, 0, 0, 0.20)",
                }}
              >
                <Image src={BSC} alt="bsc" width={18} height={18} />
                BSC Chain
              </div>
            </div>
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-2">
                <Image src={ZO} alt="zo" width={32} height={32} />
                <p className="text-2xl font-semibold text-white">ZO</p>
              </div>
              <input
                className="max-w-[60%] appearance-none border-transparent bg-transparent text-right text-2xl font-semibold text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                value={valueInPut}
                onChange={(e) => setValueInput(Number(e.target.value))}
              />
            </div>
            <div className="flex w-full items-center justify-between text-sm font-normal text-white">
              <div>
                <p className="mb-1">
                  ZO Balance:{" "}
                  {isBalanceLoadingZOBNB
                    ? "Loading..."
                    : balanceDataZOBNB
                      ? `${balanceDataZOBNB.formatted} ${balanceDataZOBNB.symbol}`
                      : "invalid token"}{" "}
                </p>
                {valueInPut &&
                balanceDataZOBNB &&
                valueInPut > Number(balanceDataZOBNB?.formatted) ? (
                  <p className="text-sm font-medium text-[#FF2D2D]">
                    Insufficient balance
                  </p>
                ) : null}
              </div>
              <button
                className="rounded-[8px] px-4 py-1 text-[#A2FE11]"
                style={{
                  background: "rgba(255, 255, 255, 0.20",
                }}
                onClick={() =>
                  setValueInput(Number(balanceDataZOBNB?.formatted))
                }
              >
                Max
              </button>
            </div>
          </div>
          <Image
            src={Swap}
            alt="swap"
            width={48}
            height={48}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/3"
          />
          <div
            className="flex flex-col gap-4 rounded-lg px-4 pb-7 pt-4"
            style={{
              background:
                "linear-gradient(181deg, rgba(40, 60, 94, 0.95) 7.43%, rgba(43, 66, 132, 0.95) 93.92%)",
            }}
          >
            <div className="flex items-center justify-between text-white">
              <p className="text-sm font-medium">You get</p>
              <div
                className="flex items-center gap-2 rounded-full px-2 py-1 text-xs font-normal"
                style={{
                  background: "rgba(0, 0, 0, 0.20)",
                }}
              >
                <Image src={ARB} alt="arb" width={18} height={18} />
                ARB Chain
              </div>
            </div>
            <div className="flex h-9 w-full justify-between">
              <div className="flex items-center gap-2">
                <Image src={ZO} alt="zo" width={32} height={32} />
                <p className="text-2xl font-semibold text-white">ZO</p>
              </div>
              <input
                className="h-9 max-w-[60%] appearance-none border-transparent bg-transparent text-right text-2xl font-semibold text-white focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
              />
            </div>
            <div className="flex w-full items-center justify-between text-sm font-normal text-white">
              <p>
                ZO Balance:{" "}
                {isBalanceLoadingZOARB
                  ? "Loading..."
                  : balanceDataZOARB
                    ? `${balanceDataZOARB.formatted} ${balanceDataZOARB.symbol}`
                    : "invalid token"}
              </p>
            </div>
          </div>
        </div>

        {valueInPut &&
        balanceDataZOBNB &&
        valueInPut > Number(balanceDataZOBNB?.formatted) ? (
          <div
            className="mb-6 flex w-full gap-3 rounded border-l-4 border-solid border-[#91caff] px-6 py-5"
            style={{
              background: "rgba(47, 65, 120, 0.80)",
            }}
          >
            <div>
              <Image
                src={Info}
                alt="info"
                width={24}
                height={24}
                className="h-fit"
              />
            </div>
            <div>
              <p className="mb-2 text-base font-semibold text-[#D9D9D9]">
                Insufficient ZO balance
              </p>
              <p className="text-base font-normal text-[#D9D9D9]">
                You need {valueInPut - Number(balanceDataZOBNB?.formatted)} ZO
                more to complete this swap transaction
              </p>
            </div>
          </div>
        ) : null}
        <button
          className="mb-3 w-full rounded-[8px] py-4 text-base font-extrabold text-[#101828]"
          style={{
            background: "linear-gradient(90deg, #58A3FF 0%, #95EE3E 100%)",
          }}
          onClick={() => setShowPopup(true)}
        >
          Swap token
        </button>
        <p className="text-sm font-medium text-[#8892A2]">
          BNB Balance:{" "}
          <span className="text-white">
            {isBalanceLoadingBNB
              ? "Loading..."
              : balanceDataBNB
                ? `${balanceDataBNB.formatted} ${balanceDataBNB.symbol}`
                : "No balance"}{" "}
          </span>
        </p>

        {showPopup && (
          <div className="modal modal-open ">
            <div className="py=8 modal-box flex flex-col items-center justify-between gap-6 bg-[#272D47] px-4">
              <Image src={ZO} alt="zo" width={60} height={60} />
              <p className="text-center text-2xl font-semibold text-white">
                Are you sure you want to swap {`${valueInPut}`} ZO?
              </p>
              <div className="modal-action">
                <button
                  className="btn bg-[#A3FF12] text-black hover:bg-[#A3FF12]"
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
  return <></>;
}
