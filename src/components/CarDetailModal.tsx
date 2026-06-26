import { useState } from 'react';
import type { EncarCar } from '@/data/cars';
import { useCarDetail } from '@/hooks/useCarDetail';
import type { Inspection, InspectionPanel } from '@/hooks/useCarDetail';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ChevronLeft, ChevronRight, MessageCircle, MapPin, ChevronDown, ChevronUp,
} from 'lucide-react';
import RecommendedCars from './RecommendedCars';
import {
  carDisplayName, translateFuel, translateTrans, translateColor, translateRegion,
  krwToEur, fmtEur, fmtKm, photoUrl, formatFormYear,
  kosovoPriceBreakdown, albaniaPriceBreakdown,
  panelClass, panelLabel, translateOption,
  VEHICLE_TYPE_MAP, DRIVE_TYPE_MAP,
  tr,
} from '@/lib/encar-utils';

const WA_NUMBER = '38343502651';

interface CarDetailModalProps {
  car: EncarCar | null;
  allCars: EncarCar[];
  open: boolean;
  onClose: () => void;
  onSelectCar?: (car: EncarCar) => void;
}

// ── Photo gallery ─────────────────────────────────────────────────────────────

function photoPath(p: { location?: string; RealName?: string }): string {
  return photoUrl(p.location ?? p.RealName ?? '');
}

function PhotoGallery({ photos }: { photos: { location?: string; RealName?: string }[] }) {
  const [idx, setIdx] = useState(0);
  if (!photos.length) return null;
  const total = photos.length;
  const prev = () => setIdx(i => (i - 1 + total) % total);
  const next = () => setIdx(i => (i + 1) % total);

  return (
    <div className="relative w-full bg-secondary/30">
      <img
        src={photoPath(photos[idx])}
        alt={`Foto ${idx + 1}`}
        className="w-full max-h-[50vh] object-contain"
        onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
      />
      {total > 1 && (
        <>
          <button onClick={prev} className="gallery-arrow left-2" aria-label="Foto e mëparshme">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next} className="gallery-arrow right-2" aria-label="Foto tjetër">
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="gallery-count">{idx + 1} / {total}</div>
        </>
      )}
      {/* Thumbnail strip */}
      {total > 1 && (
        <div className="gallery-strip">
          {photos.map((p, i) => (
            <img
              key={i}
              src={photoPath(p)}
              alt={`Thumb ${i + 1}`}
              className={`gallery-thumb${i === idx ? ' active' : ''}`}
              onClick={() => setIdx(i)}
              onError={e => { (e.target as HTMLImageElement).src = '/placeholder.svg'; }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Price calculator ──────────────────────────────────────────────────────────

function PriceCalculator({ eurPrice, year }: { eurPrice: number; year: number }) {
  const [open, setOpen] = useState(false);
  const kos = kosovoPriceBreakdown(eurPrice);
  const alb = albaniaPriceBreakdown(eurPrice, year);

  return (
    <div className="price-calc">
      <button
        className="flex items-center justify-between w-full font-semibold text-sm"
        onClick={() => setOpen(o => !o)}
      >
        <span>💰 Llogaritja e çmimit (Kosovo &amp; Shqipëri)</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {open && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kosovo */}
          <div>
            <p className="font-semibold text-sm mb-2">🇽🇰 Kosovo</p>
            <div className="price-row"><span>Çmimi Korea</span><span>{fmtEur(eurPrice)}</span></div>
            <div className="price-row"><span>+ Transporti</span><span>~{fmtEur(kos.shipping)}</span></div>
            <div className="price-row"><span>+ Dogana (10%)</span><span>{fmtEur(kos.customs)}</span></div>
            <div className="price-row"><span>+ TVSH (18%)</span><span>{fmtEur(kos.vat)}</span></div>
            <div className="price-row"><span>+ Regjistrimi</span><span>~{fmtEur(kos.registration)}</span></div>
            <div className="price-total price-row"><span>= Totali Kosovo</span><span>{fmtEur(kos.total)}</span></div>
          </div>
          {/* Albania */}
          <div>
            <p className="font-semibold text-sm mb-2">🇦🇱 Shqipëri</p>
            <div className="price-row"><span>Çmimi Korea</span><span>{fmtEur(eurPrice)}</span></div>
            <div className="price-row"><span>+ Transporti</span><span>~{fmtEur(alb.shipping)}</span></div>
            <div className="price-row"><span>+ Dogana (5%)</span><span>{fmtEur(alb.customs)}</span></div>
            <div className="price-row"><span>+ TVAT (20%)</span><span>{fmtEur(alb.vat)}</span></div>
            <div className="price-row"><span>+ Regjistrimi</span><span>~{fmtEur(alb.registration)}</span></div>
            <div className="price-total price-row"><span>= Totali Shqipëri</span><span>{fmtEur(alb.total)}</span></div>
            {alb.note && <p className="text-xs text-muted-foreground mt-1">ℹ️ {alb.note}</p>}
          </div>
        </div>
      )}
      <p className="price-disclaimer mt-3">⚠️ Vlerësim aproximativ — kontaktoni për çmim final</p>
    </div>
  );
}

// ── Panel diagram ─────────────────────────────────────────────────────────────

interface PanelCellProps {
  label: string;
  panel?: InspectionPanel;
  span?: number;
}

function PanelCell({ label, panel, span = 1 }: PanelCellProps) {
  const cls = panelClass(panel?.Status);
  const status = panelLabel(panel?.Status);
  const sev = panel?.Severity ? ` (${panel.Severity})` : '';
  return (
    <div
      className={`panel-cell ${cls}`}
      style={{ gridColumn: span > 1 ? `span ${span}` : undefined }}
      title={`${label}: ${status}${sev}`}
    >
      <div className="text-[9px] leading-tight">{label}</div>
      {panel?.Status && <div className="text-[8px] mt-0.5 opacity-90">{status}</div>}
    </div>
  );
}

function AccidentReport({ car, inspection }: { car: EncarCar; inspection: Inspection | null }) {
  const accidentCount = car.Accident ?? 0;
  const panels = inspection?.Inspect?.BodyPanelStatus;
  const mech = inspection?.Inspect;

  return (
    <div>
      <h4 className="font-heading font-semibold mb-3 flex items-center gap-2">
        🔍 Raporti i Aksidenteve
      </h4>

      {/* Summary */}
      <div className="mb-4">
        {accidentCount === 0 ? (
          <Badge className="bg-green-600 text-white text-sm px-3 py-1">✅ Asnjë aksident</Badge>
        ) : (
          <Badge className="bg-red-600 text-white text-sm px-3 py-1">⚠️ {accidentCount} aksident(e)</Badge>
        )}
      </div>

      {panels ? (
        <>
          {/* Body panel grid — top-down car view */}
          <div className="panel-grid">
            <PanelCell label="Krahë Ballor L" panel={panels.FrontLeftFender} />
            <PanelCell label="Kapota" panel={panels.Hood} />
            <PanelCell label="Krahë Ballor R" panel={panels.FrontRightFender} />

            <PanelCell label="Derë Ballore L" panel={panels.FrontLeftDoor} />
            <PanelCell label="Çati" panel={panels.RoofPanel} />
            <PanelCell label="Derë Ballore R" panel={panels.FrontRightDoor} />

            <PanelCell label="Derë Prapa L" panel={panels.RearLeftDoor} />
            <PanelCell label="Çati (mes)" panel={panels.RoofPanel} />
            <PanelCell label="Derë Prapa R" panel={panels.RearRightDoor} />

            <PanelCell label="Krahë Prapa L" panel={panels.RearLeftFender} />
            <PanelCell label="Portbagazh" panel={panels.Trunk} />
            <PanelCell label="Krahë Prapa R" panel={panels.RearRightFender} />
          </div>

          {/* Structural panels */}
          <p className="text-xs font-medium text-muted-foreground mt-3 mb-1">Panelet strukturore:</p>
          <div className="struct-row">
            <div className={`panel-cell struct-cell ${panelClass(panels.Pillar?.Status)}`} title={`Pillar: ${panelLabel(panels.Pillar?.Status)}`}>Shtylla</div>
            <div className={`panel-cell struct-cell ${panelClass(panels.Crossmember?.Status)}`} title={`Crossmember: ${panelLabel(panels.Crossmember?.Status)}`}>Traversë</div>
            <div className={`panel-cell struct-cell ${panelClass(panels.SideMemeber?.Status)}`} title={`Side Member: ${panelLabel(panels.SideMemeber?.Status)}`}>Anësor</div>
            <div className={`panel-cell struct-cell ${panelClass(panels.InnerPanel?.Status)}`} title={`Inner Panel: ${panelLabel(panels.InnerPanel?.Status)}`}>Panel i brendshëm</div>
            <div className={`panel-cell struct-cell ${panelClass(panels.DashPanel?.Status)}`} title={`Dash Panel: ${panelLabel(panels.DashPanel?.Status)}`}>Panel ballor</div>
            <div className={`panel-cell struct-cell ${panelClass(panels.FloorPanel?.Status)}`} title={`Floor Panel: ${panelLabel(panels.FloorPanel?.Status)}`}>Dysheme</div>
            <div className={`panel-cell struct-cell ${panelClass(panels.TrunkFloor?.Status)}`} title={`Trunk Floor: ${panelLabel(panels.TrunkFloor?.Status)}`}>Dysheme portbagazh</div>
          </div>

          {/* Legend */}
          <div className="panel-legend">
            <span><span className="legend-dot" style={{ background: '#22c55e' }} />Origjinal</span>
            <span><span className="legend-dot" style={{ background: '#eab308' }} />Ripikturuar</span>
            <span><span className="legend-dot" style={{ background: '#f97316' }} />Zëvendësuar</span>
            <span><span className="legend-dot" style={{ background: '#ef4444' }} />Riparuar pas aksidentit</span>
            <span><span className="legend-dot" style={{ background: '#e5e7eb' }} />Pa të dhëna</span>
          </div>
        </>
      ) : inspection === null ? (
        <p className="text-sm text-muted-foreground">Të dhënat e inspektimit nuk janë disponueshme.</p>
      ) : (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </div>
      )}

      {/* Mechanical checks */}
      {mech && (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="bg-secondary/50 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Motorri</p>
            <p className="text-sm font-semibold">{mech.Engine === 'A' ? '✅ Mirë' : mech.Engine ? '⚠️ Problem' : '—'}</p>
          </div>
          <div className="bg-secondary/50 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Transmisioni</p>
            <p className="text-sm font-semibold">{mech.Transmission === 'A' ? '✅ Mirë' : mech.Transmission ? '⚠️ Problem' : '—'}</p>
          </div>
          <div className="bg-secondary/50 rounded p-2 text-center">
            <p className="text-xs text-muted-foreground">Sistemi trans.</p>
            <p className="text-sm font-semibold">{mech.PowerTrain === 'A' ? '✅ Mirë' : mech.PowerTrain ? '⚠️ Problem' : '—'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Spec row ──────────────────────────────────────────────────────────────────

function SpecRow({ label, value }: { label: string; value: string | number | undefined | null }) {
  const display = value != null && value !== '' ? String(value) : '—';
  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{display}</span>
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────────

const CarDetailModal = ({ car, allCars, open, onClose, onSelectCar }: CarDetailModalProps) => {
  const { data, isLoading } = useCarDetail(car?.Id ?? null);

  if (!car) return null;

  const detail: EncarCar = data?.detail ?? car;
  const inspection: Inspection | null = data?.inspection ?? null;

  const name = carDisplayName(car.Manufacturer, car.Model, car.Badge);
  const eurPrice = krwToEur(car.Price);
  const photos = detail.Photos?.length ? detail.Photos : car.Photos?.length ? car.Photos : [];
  // FormYear is the 4-digit model year; Year is YYYYMM from the API
  const displayYear = car.FormYear
    ? String(car.FormYear).slice(0, 4)
    : String(Math.floor(Number(car.Year) / 100) || car.Year);
  const numericYear = parseInt(displayYear, 10) || new Date().getFullYear();

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Përshëndetje! Jam i interesuar për ${name} (${displayYear}), ${fmtKm(car.Mileage)}, ${fmtEur(eurPrice)}. A mund të më jepni informata?`
    );
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  const handleSelectRecommended = (selected: EncarCar) => {
    if (onSelectCar) onSelectCar(selected);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[95vh]">
          <div>
            {/* Photo gallery */}
            {photos.length > 0 ? (
              <PhotoGallery photos={photos} />
            ) : (
              <div className="w-full h-48 bg-secondary/30 flex items-center justify-center text-muted-foreground">
                Pa foto
              </div>
            )}

            <div className="p-6">
              <DialogHeader className="mb-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                      {carDisplayName(car.Manufacturer, '', '')}
                    </p>
                    <DialogTitle className="font-heading text-2xl md:text-3xl font-bold">
                      {car.Model} {car.Badge}
                    </DialogTitle>
                    {car.BadgeSub && <p className="text-sm text-muted-foreground mt-1">{tr(car.BadgeSub)}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Çmimi (Korea)</p>
                    <p className="font-heading text-3xl font-bold text-primary">{fmtEur(eurPrice)}</p>
                    <p className="text-xs text-muted-foreground">₩{(car.Price * 10000).toLocaleString()}</p>
                  </div>
                </div>
              </DialogHeader>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {car.Accident === 0 && <Badge className="bg-green-600 text-white">✅ Pa aksident</Badge>}
                {car.Certified === 'Y' && <Badge className="bg-blue-600 text-white">⭐ Certifikuar Encar</Badge>}
                {car.Warranty === 'Y' && <Badge className="bg-purple-600 text-white">🛡️ Garanci</Badge>}
                {car.OneOwner === 'Y' && <Badge className="bg-amber-600 text-white">👤 Pronar i parë</Badge>}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Viti', value: displayYear },
                  { label: 'Kilometrazha', value: fmtKm(car.Mileage) },
                  { label: 'Karburanti', value: translateFuel(car.FuelType) },
                  { label: 'Transmisioni', value: translateTrans(car.Transmission) },
                  { label: 'Motorri', value: car.CylinderCapacity ? `${car.CylinderCapacity} cc` : '—' },
                  { label: 'Fuqia', value: detail.EnginePower ? `${detail.EnginePower} hp` : '—' },
                  { label: 'Ngjyra', value: translateColor(car.Color) },
                  { label: 'Rajoni', value: translateRegion(car.Region ?? '') },
                ].map(s => (
                  <div key={s.label} className="bg-secondary/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                    <p className="font-semibold text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Price calculator */}
              <PriceCalculator eurPrice={eurPrice} year={numericYear} />

              <Separator className="my-6" />

              {/* Full specs */}
              <div className="mb-6">
                <h4 className="font-heading font-semibold mb-3">📋 Specifikimet e plota</h4>
                {isLoading ? (
                  <div className="space-y-2">{[...Array(8)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
                ) : (
                  <div className="spec-grid">
                    <SpecRow label="Viti prodhimit" value={formatFormYear(car.FormYear)} />
                    <SpecRow label="Kilometrazha" value={fmtKm(car.Mileage)} />
                    <SpecRow label="Karburanti" value={translateFuel(car.FuelType)} />
                    <SpecRow label="Transmisioni" value={translateTrans(car.Transmission)} />
                    <SpecRow label="Motorri" value={car.CylinderCapacity ? `${car.CylinderCapacity} cc` : undefined} />
                    <SpecRow label="Fuqia" value={detail.EnginePower ? `${detail.EnginePower} hp` : undefined} />
                    <SpecRow label="Çift rrotullues" value={detail.EngineTorque ? `${detail.EngineTorque} kgm` : undefined} />
                    <SpecRow label="Efikasiteti" value={detail.FuelEfficiency ? `${detail.FuelEfficiency} km/L` : undefined} />
                    <SpecRow label="Numri i cilindrave" value={detail.NumberOfCylinders} />
                    <SpecRow label="Numri i shpejtësive" value={detail.NumberOfGears} />
                    <SpecRow label="Sistemi i tërheqjes" value={detail.DriveType ? (DRIVE_TYPE_MAP[detail.DriveType] ?? detail.DriveType) : undefined} />
                    <SpecRow label="Ngjyra (jashtme)" value={translateColor(car.Color)} />
                    <SpecRow label="Ngjyra (brendshme)" value={detail.InteriorColor ? translateColor(detail.InteriorColor) : undefined} />
                    <SpecRow label="Lloji i automjetit" value={detail.VehicleType ? (VEHICLE_TYPE_MAP[detail.VehicleType] ?? tr(detail.VehicleType)) : undefined} />
                    <SpecRow label="Numri i dyerve" value={detail.DoorCount} />
                    <SpecRow label="Kapaciteti" value={detail.SeatingCapacity ? `${detail.SeatingCapacity} vende` : undefined} />
                    <SpecRow label="Importuar" value={detail.ImportedCar === 'Y' ? 'Po' : detail.ImportedCar === 'N' ? 'Jo' : undefined} />
                    <SpecRow label="Garanci" value={detail.Warranty === 'Y' ? 'Ka garanci' : detail.Warranty === 'N' ? 'Pa garanci' : undefined} />
                    <SpecRow label="Rajoni (Korea)" value={translateRegion(car.Region ?? '')} />
                    <SpecRow label="Pesha" value={detail.Weight ? `${detail.Weight} kg` : undefined} />
                    <SpecRow label="Gjatësia" value={detail.Length ? `${detail.Length} mm` : undefined} />
                    <SpecRow label="Gjerësia" value={detail.Width ? `${detail.Width} mm` : undefined} />
                    <SpecRow label="Lartësia" value={detail.Height ? `${detail.Height} mm` : undefined} />
                    <SpecRow label="Baza e rrotave" value={detail.WheelBase ? `${detail.WheelBase} mm` : undefined} />
                    <SpecRow label="Depozita karburanti" value={detail.FuelTankCapacity ? `${detail.FuelTankCapacity} L` : undefined} />
                  </div>
                )}
              </div>

              {/* Options */}
              {(isLoading || (detail.Options && detail.Options.length > 0)) && (
                <>
                  <Separator className="my-4" />
                  <div className="mb-6">
                    <h4 className="font-heading font-semibold mb-3">⚙️ Pajisjet &amp; Opsionet</h4>
                    {isLoading ? (
                      <Skeleton className="h-16 w-full" />
                    ) : (
                      <div className="opts">
                        {detail.Options!.map((opt, i) => (
                          <span key={i} className="opt-pill">{translateOption(opt.Name)}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <Separator className="my-4" />

              {/* Accident report */}
              <div className="mb-6">
                <AccidentReport car={car} inspection={inspection} />
              </div>

              <Separator className="my-4" />

              {/* Ownership */}
              <div className="mb-6">
                <h4 className="font-heading font-semibold mb-3">📜 Historia e pronësisë</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-secondary/50 rounded p-3 text-center">
                    <p className="text-xs text-muted-foreground">Numri i pronarëve</p>
                    <p className="font-semibold">{car.Owners ?? '—'}</p>
                  </div>
                  <div className="bg-secondary/50 rounded p-3 text-center">
                    <p className="text-xs text-muted-foreground">Pronar i parë</p>
                    <p className="font-semibold">{car.OneOwner === 'Y' ? '✅ Po' : car.OneOwner === 'N' ? 'Jo' : '—'}</p>
                  </div>
                  <div className="bg-secondary/50 rounded p-3 text-center">
                    <p className="text-xs text-muted-foreground">Certifikuar Encar</p>
                    <p className="font-semibold">{car.Certified === 'Y' ? '⭐ Po' : car.Certified === 'N' ? 'Jo' : '—'}</p>
                  </div>
                  <div className="bg-secondary/50 rounded p-3 text-center">
                    <p className="text-xs text-muted-foreground">Garanci</p>
                    <p className="font-semibold">{detail.Warranty === 'Y' ? '🛡️ Ka' : detail.Warranty === 'N' ? 'Jo' : '—'}</p>
                  </div>
                </div>
              </div>

              {/* Tire condition */}
              {detail.TireCondition && Object.values(detail.TireCondition).some(Boolean) && (
                <>
                  <Separator className="my-4" />
                  <div className="mb-6">
                    <h4 className="font-heading font-semibold mb-3">🔵 Gjendja e gomave</h4>
                    <div className="grid grid-cols-2 gap-3 max-w-xs">
                      {[
                        { pos: 'Para L', val: detail.TireCondition.FL },
                        { pos: 'Para R', val: detail.TireCondition.FR },
                        { pos: 'Prapa L', val: detail.TireCondition.RL },
                        { pos: 'Prapa R', val: detail.TireCondition.RR },
                      ].map(t => (
                        <div key={t.pos} className="bg-secondary/50 rounded p-2 text-center">
                          <p className="text-xs text-muted-foreground">{t.pos}</p>
                          <p className="text-sm font-semibold">{t.val ?? '—'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator className="my-6" />

              {/* Contact buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="flex-1 btn-whatsapp text-lg py-6 font-semibold shadow-lg"
                  size="lg"
                  onClick={handleWhatsApp}
                >
                  <MessageCircle className="h-6 w-6 mr-3" />Shkruaj në WhatsApp
                </Button>
                <Button variant="outline" size="lg" className="flex-1 text-lg py-6 font-semibold border-2 hover:bg-secondary">
                  <MapPin className="h-6 w-6 mr-3" />Ferizaj, Drenas
                </Button>
              </div>

              {/* Recommended */}
              <RecommendedCars
                cars={allCars}
                currentCarId={car.Id}
                onSelectCar={handleSelectRecommended}
              />
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CarDetailModal;
