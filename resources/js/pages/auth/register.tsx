// import { Form, Head } from '@inertiajs/react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import InputError from '@/components/ui/input-error';
// import { Label } from '@/components/ui/label';
// import PasswordInput from '@/components/ui/password-input';
// import { Spinner } from '@/components/ui/spinner';
// import TextLink from '@/components/ui/text-link';
// import AuthLayout from '@/layouts/auth-layout';
// import { login } from '@/routes';
// import { store } from '@/routes/register';

// export default function Register() {
//     return (
//         <AuthLayout title="Buat akun baru" description="Masukkan detail Anda di bawah ini untuk mendaftar">
//             <Head title="Daftar" />
//             <Form
//                 {...store.form()}
//                 resetOnSuccess={['password', 'password_confirmation']}
//                 disableWhileProcessing
//                 className="flex flex-col gap-6"
//             >
//                 {({ processing, errors }) => (
//                     <>
//                         <div className="grid gap-6">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="name">Nama Lengkap</Label>
//                                 <Input
//                                     id="name"
//                                     type="text"
//                                     required
//                                     autoFocus
//                                     tabIndex={1}
//                                     autoComplete="name"
//                                     name="name"
//                                     placeholder="Nama Lengkap"
//                                 />
//                                 <InputError message={errors.name} className="mt-2" />
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="email">Alamat Email</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     required
//                                     tabIndex={2}
//                                     autoComplete="email"
//                                     name="email"
//                                     placeholder="email@contoh.com"
//                                 />
//                                 <InputError message={errors.email} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="password">Kata Sandi</Label>
//                                 <PasswordInput
//                                     id="password"
//                                     required
//                                     tabIndex={3}
//                                     autoComplete="new-password"
//                                     name="password"
//                                     placeholder="Kata Sandi"
//                                 />
//                                 <InputError message={errors.password} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <Label htmlFor="password_confirmation">Konfirmasi Kata Sandi</Label>
//                                 <PasswordInput
//                                     id="password_confirmation"
//                                     required
//                                     tabIndex={4}
//                                     autoComplete="new-password"
//                                     name="password_confirmation"
//                                     placeholder="Konfirmasi Kata Sandi"
//                                 />
//                                 <InputError message={errors.password_confirmation} />
//                             </div>

//                             <Button
//                                 type="submit"
//                                 className="mt-2 w-full font-semibold"
//                                 tabIndex={5}
//                                 data-test="register-user-button"
//                             >
//                                 {processing && <Spinner />}
//                                 Buat Akun
//                             </Button>
//                         </div>

//                         <div className="text-center text-sm text-muted-foreground">
//                             Sudah punya akun?{' '}
//                             <TextLink href={login()} tabIndex={6} className="font-semibold text-primary">
//                                 Masuk sekarang
//                             </TextLink>
//                         </div>
//                     </>
//                 )}
//             </Form>
//         </AuthLayout>
//     );
// }
