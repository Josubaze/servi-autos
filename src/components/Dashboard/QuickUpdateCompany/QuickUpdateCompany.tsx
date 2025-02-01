import { SectionTitle } from "src/components/Common/SectionTitle";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanySchema } from "src/utils/validation.zod";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Skeleton from "@mui/material/Skeleton"; // Import Skeleton for loading state
import { useUpdateCompanyMutation } from "src/redux/services/company.Api";
import { Button, Input } from "@nextui-org/react";
import { useSession } from "next-auth/react";

type QuickUpdateCompanyProps = {
  company: Company;
  isErrorCompany: boolean;
  isLoadingCompany: boolean;
};

export const QuickUpdateCompany = ({
  company,
  isErrorCompany,
  isLoadingCompany,
}: QuickUpdateCompanyProps) => {
  const [updateCompany] = useUpdateCompanyMutation();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<Company>({
    resolver: zodResolver(CompanySchema),
    defaultValues: company,
  });
  const { data: session } = useSession(); 
  const isLider = session?.user.role === 'lider';

  const onSubmit: SubmitHandler<Company> = async (data) => {
    if (isLider) return;
    try {
      await updateCompany(data).unwrap();
      toast.success("Actualizado Exitosamente!");
    } catch (error) {
      toast.error("Error al actualizar la Empresa");
    }
  };

  useEffect(() => {
    if (company) {
      reset(company);
    }
  }, [company, reset]);

  return (
    <div className="bg-black-nav/50 rounded-xl p-4 mt-4">
      <SectionTitle>{isLider ? "DATOS DE EMPRESA" : "ACTUALIZAR EMPRESA"}</SectionTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-lg pt-2 mx-auto rounded-xl"
      >
        {isLoadingCompany ? (
          <div>
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
            <Skeleton variant="text" width="100%" height={80} sx={{ bgcolor: 'grey.900' }} />
          </div>  
        ) : (
          <>
            <div className="mb-4">
                <Controller
                  name="id_card"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="RIF"
                      variant="underlined"
                      fullWidth
                      {...field}
                      isInvalid={!!errors.id_card}
                      errorMessage={errors.id_card?.message}
                      disabled={isLider || isLoadingCompany}
                    />
                  )}
                />
            </div>

            <div className="mb-4">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Nombre"
                    variant="underlined"
                    fullWidth
                    {...field}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name?.message}
                    disabled={isLider || isLoadingCompany}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Correo Electrónico"
                    variant="underlined"
                    fullWidth
                    {...field}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    disabled={isLider || isLoadingCompany}
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Teléfono"
                    variant="underlined"
                    fullWidth
                    {...field}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone?.message}
                    disabled={isLider || isLoadingCompany} 
                  />
                )}
              />
            </div>

            <div className="mb-4">
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Dirección"
                    variant="underlined"
                    fullWidth
                    {...field}
                    isInvalid={!!errors.address}
                    errorMessage={errors.address?.message}
                    disabled={isLider || isLoadingCompany} 
                  />
                )}
              />
            </div>

            {!isLider && (
              <div className="flex items-center justify-between mt-4">
                <Button
                    color="warning"
                    variant="solid"
                    fullWidth
                    isLoading={isLoadingCompany}
                    type="submit"
                >
                    Actualizar
                </Button>
              </div>
            )}
          </>
        )}

        {isErrorCompany && toast.error('Hubo un error al cargar la Empresa')}
      </form>
    </div>
  );
};
