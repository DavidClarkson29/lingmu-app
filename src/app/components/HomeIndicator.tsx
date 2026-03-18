interface HomeIndicatorProps {
  mode: "night" | "day";
}

export function HomeIndicator({ mode }: HomeIndicatorProps) {
  const isNight = mode === "night";
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingBottom: 12,
        paddingTop: 6,
      }}
    >
      <div
        style={{
          width: 134,
          height: 5,
          borderRadius: 100,
          background: isNight ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)",
          transition: "background 0.3s",
        }}
      />
    </div>
  );
}