const sendHash = async (hash: string) => {
  if (!process.env.NEXT_PUBLIC_API) {
    throw new Error("NEXT_PUBLIC_API chưa được cấu hình");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API}/transactions-on-chain/listen/${hash}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Gửi hash thất bại");
  }

  return res.json();
};

export default sendHash;
