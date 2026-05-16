import { ImagePlus, X } from 'lucide-react';
import { Activity, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useOutletTambah } from '@/hooks/feature/outlet/use-outlet-tambah';

export function OutletTambahForm() {
    const { data, setData, errors, clearErrors, picturePreview, handlePictureChange, handleRemovePicture, handleSubmit } = useOutletTambah();

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <FieldSet>
                <FieldGroup>
                    <Field data-invalid={!!errors.picture}>
                        <FieldLabel htmlFor="picture">Gambar / Logo Outlet</FieldLabel>
                        <div className="flex items-start gap-4">
                            <div className="relative flex aspect-square size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30">
                                <Activity mode={picturePreview ? 'visible' : 'hidden'}>
                                    <img src={picturePreview || ''} alt="Preview" className="h-full w-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="destructive"
                                            className="size-7 rounded-full"
                                            onClick={() => {
                                                handleRemovePicture();
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                        >
                                            <X size={14} />
                                        </Button>
                                    </div>
                                </Activity>

                                <Activity mode={picturePreview ? 'hidden' : 'visible'}>
                                    <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
                                        <ImagePlus className="mb-1 size-6 opacity-50" />
                                        <span className="text-[10px] font-medium tracking-wider uppercase opacity-50">
                                            Upload
                                        </span>
                                    </div>
                                </Activity>
                            </div>

                            <div className="flex flex-col gap-2 pt-1">
                                <Input
                                    ref={fileInputRef}
                                    id="picture"
                                    type="file"
                                    accept="image/png, image/jpeg, image/jpg"
                                    className="max-w-[250px] cursor-pointer"
                                    onChange={handlePictureChange}
                                />
                                <span className="text-xs text-muted-foreground">
                                    Format: JPG, JPEG, PNG. Maks ukuran: 2MB.
                                </span>
                            </div>
                        </div>
                        <Activity mode={errors.picture ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.picture}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.name}>
                        <FieldLabel htmlFor="name">
                            Nama <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.name}
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Contoh: Outlet Cabang Utama"
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                clearErrors('name');
                            }}
                        />
                        <Activity mode={errors.name ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.name}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.address}>
                        <FieldLabel htmlFor="address">
                            Alamat <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                            aria-invalid={!!errors.address}
                            id="address"
                            type="text"
                            name="address"
                            placeholder="Contoh: Jalan Sudirman No. 123"
                            value={data.address}
                            onChange={(e) => {
                                setData('address', e.target.value);
                                clearErrors('address');
                            }}
                        />
                        <Activity mode={errors.address ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.address}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.email}>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            aria-invalid={!!errors.email}
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Contoh: outlet.pusat@gmail.com"
                            value={data.email}
                            onChange={(e) => {
                                setData('email', e.target.value);
                                clearErrors('email');
                            }}
                        />
                        <Activity mode={errors.email ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.email}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field data-invalid={!!errors.phone}>
                        <FieldLabel htmlFor="phone">Telepon</FieldLabel>
                        <Input
                            aria-invalid={!!errors.phone}
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="Contoh: 08123456789"
                            value={data.phone}
                            onChange={(e) => {
                                setData('phone', e.target.value);
                                clearErrors('phone');
                            }}
                        />
                        <Activity mode={errors.phone ? 'visible' : 'hidden'}>
                            <FieldDescription className="text-destructive">{errors.phone}</FieldDescription>
                        </Activity>
                    </Field>

                    <Field orientation={'responsive'} className="ml-auto">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Batal
                        </Button>
                        <Button type="submit">Simpan</Button>
                    </Field>
                </FieldGroup>
            </FieldSet>
        </form>
    );
}
