import { useGameStore } from "../store/gameStore";
import "./UIOverlay.css";

export default function UIOverlay() {
  const status = useGameStore((s) => s.status);
  const score = useGameStore((s) => s.score);
  const heartsCollected = useGameStore((s) => s.heartsCollected);
  const startGame = useGameStore((s) => s.startGame);
  const romanticMessage = useGameStore((s) => s.romanticMessage);
  const showRomanticMessage = useGameStore((s) => s.showRomanticMessage);
  const selectedReward = useGameStore((s) => s.selectedReward);
  const selectReward = useGameStore((s) => s.selectReward);
  const claimReward = useGameStore((s) => s.claimReward);

  return (
    <div className="ui-overlay">
      {/* HUD */}
      {status === "playing" && (
        <div className="hud">
          <div className="score-display">
            <span className="score-label">Score</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="hearts-display">
            <span className="heart-icon">❤️</span>
            <span className="hearts-value">{heartsCollected}</span>
          </div>
        </div>
      )}

      {/* Romantic message popup */}
      {showRomanticMessage && (
        <div className="romantic-message">
          <span>{romanticMessage}</span>
        </div>
      )}

      {/* Menu Screen */}
      {status === "menu" && (
        <div className="menu-screen">
          <div className="menu-content">
            <h1 className="game-title">💕 Our Love Runner 💕</h1>
            <p className="game-subtitle">A 7 Months Anniversary Game</p>
            <div className="controls-info">
              <p>⬅️ ➡️ Switch Lanes</p>
              <p>⬆️ Jump Over Obstacles</p>
              <p>⬇️ Slide Under Barriers</p>
              <p>❤️ Collect Hearts!</p>
            </div>
            <button className="start-button" onClick={startGame}>
              Start Running 💝
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {status === "gameover" && (
        <div className="gameover-screen">
          <div className="gameover-content">
            <h1 className="gameover-title">Happy 7 Months ❤️</h1>
            <p className="gameover-subtitle">
              Thank you for every moment together
            </p>
            <div className="gameover-stats">
              <div className="stat">
                <span className="stat-label">Score</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Hearts Collected</span>
                <span className="stat-value">❤️ {heartsCollected}</span>
              </div>
            </div>
            {heartsCollected >= 5 && (
              <p className="special-message">
                🌹 You filled my heart with love! Thank you for collecting all
                my love! 🌹
              </p>
            )}
            <button className="restart-button" onClick={startGame}>
              Run Again 💕
            </button>
          </div>
        </div>
      )}

      {/* Reward Selection Screen */}
      {status === "reward" && (
        <div className="reward-screen">
          <div className="reward-content">
            <h1 className="reward-title">🎉 100 หัวใจ! 🎉</h1>
            <p className="reward-subtitle">
              คุณสะสมหัวใจครบ 100 ใจแล้ว! เลือกรางวัลของคุณ:
            </p>
            <div className="reward-options">
              <button
                className={`reward-option ${selectedReward === "netflix" ? "selected" : ""}`}
                onClick={() => selectReward("netflix")}
              >
                <div className="reward-icon">🎬</div>
                <div className="reward-name">Netflix 1 เดือน</div>
                <div className="reward-desc">ดูหนังกันแบบไม่อั้น</div>
              </button>
              <button
                className={`reward-option ${selectedReward === "question" ? "selected" : ""}`}
                onClick={() => selectReward("question")}
              >
                <div className="reward-icon">❓</div>
                <div className="reward-name">ถามได้ทุกอย่าง</div>
                <div className="reward-desc">ขอให้ตอบต้องตอบ</div>
              </button>
              <button
                className={`reward-option ${selectedReward === "money" ? "selected" : ""}`}
                onClick={() => selectReward("money")}
              >
                <div className="reward-icon">💰</div>
                <div className="reward-name">True Money</div>
                <div className="reward-desc">100 บาท</div>
              </button>
            </div>
            <button
              className="claim-button"
              onClick={claimReward}
              disabled={!selectedReward}
            >
              รับรางวัล! 🎁
            </button>
          </div>
        </div>
      )}

      {/* Mobile controls */}
      {status === "playing" && (
        <div className="mobile-controls">
          <div className="mobile-controls-left">
            <button
              className="mobile-btn left-btn"
              onTouchStart={(e) => {
                e.preventDefault();
                useGameStore.getState().moveLeft();
              }}
            >
              ⬅️
            </button>
            <button
              className="mobile-btn right-btn"
              onTouchStart={(e) => {
                e.preventDefault();
                useGameStore.getState().moveRight();
              }}
            >
              ➡️
            </button>
          </div>
          <div className="mobile-controls-right">
            <button
              className="mobile-btn up-btn"
              onTouchStart={(e) => {
                e.preventDefault();
                useGameStore.getState().jump();
                useGameStore.getState().setJumpHeld(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                useGameStore.getState().setJumpHeld(false);
              }}
              onTouchCancel={() => useGameStore.getState().setJumpHeld(false)}
            >
              ⬆️
            </button>
            <button
              className="mobile-btn down-btn"
              onTouchStart={(e) => {
                e.preventDefault();
                useGameStore.getState().slide();
                useGameStore.getState().setSlideHeld(true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                useGameStore.getState().setSlideHeld(false);
              }}
              onTouchCancel={() => useGameStore.getState().setSlideHeld(false)}
            >
              ⬇️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
