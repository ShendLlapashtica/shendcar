import { useQuery } from '@tanstack/react-query';
import type { EncarCar } from '@/data/cars';

export interface InspectionPanel {
  Status?: string;
  Severity?: string;
}

export interface Inspection {
  Inspect?: {
    Engine?: string;
    Transmission?: string;
    PowerTrain?: string;
    Accident?: number;
    BodyPanelStatus?: {
      Hood?: InspectionPanel;
      FrontLeftFender?: InspectionPanel;
      FrontRightFender?: InspectionPanel;
      FrontLeftDoor?: InspectionPanel;
      FrontRightDoor?: InspectionPanel;
      RearLeftDoor?: InspectionPanel;
      RearRightDoor?: InspectionPanel;
      Trunk?: InspectionPanel;
      RearLeftFender?: InspectionPanel;
      RearRightFender?: InspectionPanel;
      RoofPanel?: InspectionPanel;
      QuarterPanel?: InspectionPanel;
      Pillar?: InspectionPanel;
      InsidePanelFront?: InspectionPanel;
      InsidePanelRear?: InspectionPanel;
      Crossmember?: InspectionPanel;
      InnerPanel?: InspectionPanel;
      SideMemeber?: InspectionPanel;
      Wheel?: InspectionPanel;
      DashPanel?: InspectionPanel;
      FloorPanel?: InspectionPanel;
      TrunkFloor?: InspectionPanel;
    };
  };
}

export interface CarDetailResult {
  detail: EncarCar | null;
  inspection: Inspection | null;
}

async function fetchCarDetail(id: string): Promise<CarDetailResult> {
  const res = await fetch(`/api/car-detail?id=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export function useCarDetail(carId: string | null) {
  return useQuery<CarDetailResult, Error>({
    queryKey: ['encar-car-detail', carId],
    queryFn: () => fetchCarDetail(carId!),
    enabled: !!carId,
    staleTime: 1000 * 60 * 10,
  });
}
