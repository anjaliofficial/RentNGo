interface TrustScoreRingProps {
  score: number;
  size?: number;
}

export default function TrustScoreRing({ score, size = 96 }: TrustScoreRingProps) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 75 ? "#14B8A6" : score >= 50 ? "#0EA5E9" : "#787778";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#EEEDED"
          strokeWidth={8}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-headline text-2xl font-bold text-primary-900">{score}</span>
        <span className="font-label text-[10px] uppercase tracking-wide text-neutral-500">
          Trust Score
        </span>
      </div>
    </div>
  );
}
