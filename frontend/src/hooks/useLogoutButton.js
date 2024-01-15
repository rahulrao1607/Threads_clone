import useShowToast from './useShowToast';
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';

const useLogoutButton = () => {
    const showToast = useShowToast();
    const setUser = useSetRecoilState(userAtom);

    const logout = async()=>{
        try {

            const res = await fetch("/api/users/logout",{
                method : "POST",
                headers : {
                    "content-Type" : "application/json",
                },
            });
            const data =await res.json();
            if(data.error)
            {
              showToast("Error",data.error,"error");
              return;
            }
            localStorage.removeItem("user-threads");
            setUser(null);
            
        } catch (error) {
            showToast("Error", error, "error");           
        }
    };
  return logout;
}

export default useLogoutButton