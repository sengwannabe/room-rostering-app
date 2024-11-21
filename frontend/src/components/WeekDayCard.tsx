import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { formatDate } from "../utils/dateUtils";

interface WeekDayCardProps {
    date: Date;
    isDesktop?: boolean;
  }

  export const WeekDayCard: React.FC<WeekDayCardProps> = ({ date, isDesktop = false }) => (
    <Card
      elevation={0}
      sx={{
        flex: isDesktop ? 'none' : '0 0 auto',
        width: isDesktop ? 'auto' : 'calc(20% - 6px)',
        minWidth: isDesktop ? '40px' : '60px',
        bgcolor: date.toDateString() === new Date().toDateString() ? 'primary.main' : 'transparent'
      }}
    >
      <CardContent sx={{
        p: 1,
        textAlign: 'center',
        '&:last-child': { pb: 1 }
      }}>
        <Typography variant="caption" display="block">
          {isDesktop ? formatDate(date).weekDay.charAt(0) : formatDate(date).weekDay}
        </Typography>
        <Typography
          variant={isDesktop ? "subtitle1" : "h6"}
          sx={{ fontWeight: 'bold' }}
        >
          {formatDate(date).day}
        </Typography>
      </CardContent>
    </Card>
  );
