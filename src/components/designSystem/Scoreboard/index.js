import React from "react";
import {
  ScoreboardCard,
  PlayerInfo,
  Avatar,
  PlayerName,
  ScoreValue,
  VersusLabel,
} from "./Scoreboard.style";
import { EMOJIS } from "../../../logic/core/coreConfig";

/**
 * Modern Scoreboard Component
 * @param {Object} props
 * @param {Object} props.p1 - { name: string, score: number, active: boolean, emoji: string }
 * @param {Object} props.p2 - { name: string, score: number, active: boolean, emoji: string }
 */
const Scoreboard = ({ p1, p2 }) => {
  return (
    <ScoreboardCard>
      <PlayerInfo active={p1.active}>
        <Avatar color="red" active={p1.active}>{p1.emoji || EMOJIS.RED_DISC}</Avatar>
        <PlayerName active={p1.active}>{p1.name}</PlayerName>
      </PlayerInfo>

      <VersusLabel>VS</VersusLabel>

      <PlayerInfo active={p2.active}>
        <Avatar color="yellow" active={p2.active}>{p2.emoji || EMOJIS.YELLOW_DISC}</Avatar>
        <PlayerName active={p2.active}>{p2.name}</PlayerName>
      </PlayerInfo>
    </ScoreboardCard>
  );
};

export default Scoreboard;
