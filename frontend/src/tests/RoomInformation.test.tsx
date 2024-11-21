import React from "react";
import RoomInformation from "../components/RoomInformation";
import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import sampleRoom from '../mocks/testData/clancyTest.json';

describe('Room Information Page', () => {
  beforeEach(() => {
    cleanup();
  })

  test('Renders room information page, specific to mock data', async () => {
    render(
      <BrowserRouter>
        <RoomInformation />
      </BrowserRouter>
    );
    await waitFor(() => {
      // Room title is rendered
      expect(screen.getByText(sampleRoom.name)).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Capacity title is rendered
    expect(screen.getByText('Capacity')).toBeInTheDocument();
    // Capacity quantity is rendered
    expect(screen.getByText(`${sampleRoom.attributes.capacity} people`)).toBeInTheDocument();
    // Equipment is rendered with correct quantity
    expect(screen.getByText(`${sampleRoom.attributes.equipment[0]?.name} (${sampleRoom.attributes.equipment[0]?.quantity})`)).toBeInTheDocument();
    // Chemical access title is rendered
    expect(screen.getByText('Chemical Access')).toBeInTheDocument();
    // Chemical access status is rendered
    expect(screen.getByText('This room has access to chemicals')).toBeInTheDocument();
  });
});