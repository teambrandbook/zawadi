import StatCard from '@/components/communityUsers/commen/StatCard'
import { Users, Settings, Crown, UserCheck } from "lucide-react";

type Role = {
    id: number
    role_name: string
    role_status: string
    access_level: string
    member_count: number  // ✅ comes from Django serializer
}

type Props = {
    roles: Role[]
}

function Carts({ roles }: Props) {

    // ✅ Total number of roles
    const totalRoles = roles.length

    // ✅ Active members = sum of member_count across all active roles
    const activeMembers = roles
        .filter(role => role.role_status === 'active')
        .reduce((sum, role) => sum + role.member_count, 0)

    // ✅ Custom roles = roles where access_level is NOT 'full'
    const customRoles = roles.filter(role => role.access_level !== 'full').length

    // ✅ Super Admin = roles where access_level is 'full'
    const superAdmin = roles.filter(role => role.access_level === 'full').length

    return (
        <div className='flex gap-5'>
            <StatCard
                Icon={UserCheck}
                label="Total Roles"
                value={totalRoles}
                trendColor="text-green-600"
                iconBgColor="bg-white"
                iconColor="text-[#A38653]"
            />
            <StatCard
                Icon={Users}
                label="Active Members"
                value={activeMembers}       // ✅ total members in active roles
                trendColor="text-green-600"
                iconBgColor="bg-white"
                iconColor="text-[#A38653]"
            />
            <StatCard
                Icon={Settings}
                label="Custom Roles"
                value={customRoles}
                trendColor="text-green-600"
                iconBgColor="bg-white"
                iconColor="text-[#A38653]"
            />
            <StatCard
                Icon={Crown}
                label="Super Admin"
                value={superAdmin}
                trendColor="text-green-600"
                iconBgColor="bg-white"
                iconColor="text-[#A38653]"
            />
        </div>
    )
}

export default Carts