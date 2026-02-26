//import FC from react
import type { FC } from "react";

//import SidebarMenu
import SidebarMenu from '../../../components/SidebarMenu';

//import Link from react-route
import { Link } from "react-router";

//import custom hook useUsers and interface User
import { useUsers, type User } from "../../../hooks/users/useUsers";

const UsersIndex: FC = () => {

    // get users from useUsers
    const { data: users, isLoading, isError, error } = useUsers();

    return (
        <div className="container mt-5 mb-5">
            <div className="row">
                <div className="col-md-3">
                    <SidebarMenu />
                </div>
                <div className="col-md-9">
                    <div className="card border-0 rounded-4 shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span>USERS</span>
                            <Link to="/admin/users/create" className="btn btn-sm btn-success rounded-4 shadow-sm border-0">ADD USER</Link>
                        </div>
                        <div className="card-body">

                            {/* Loading State */}
                            {isLoading && (
                                <div className="alert alert-info text-center">Loading...</div>
                            )}

                            {/* Error State */}
                            {isError && (
                                <div className="alert alert-danger text-center">
                                    Error: {error.message}
                                </div>
                            )}

                            <table className="table table-bordered">
                                <thead className="bg-dark text-white">
                                    <tr>
                                        <th scope="col">Full Name</th>
                                        <th scope="col">Username</th>
                                        <th scope="col">Email Address</th>
                                        <th scope="col" style={{ width: "20%" }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users?.map((user: User) => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.username}</td>
                                                <td>{user.email}</td>
                                                <td className="text-center">
                                                    <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary rounded-4 shadow-sm border-0 me-2">EDIT</Link>
                                                    <button className="btn btn-sm btn-danger rounded-4 shadow-sm border-0">DELETE</button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsersIndex
