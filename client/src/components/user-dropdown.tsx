import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSpotifyPlayerStore } from '@/lib/providers/SpotifyPlayerProvider';
import { useTheme } from '@/lib/providers/ThemeProvider';
import { useNavigate } from '@tanstack/react-router';
import {
	Check,
	LogOut,
	Moon,
	Settings,
	Sun,
	Volume2,
	VolumeX,
} from 'lucide-react';

export function UserDropdown() {
	const { theme, setTheme } = useTheme();
	const spotify = useSpotifyPlayerStore();
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="rounded-full">
					{spotify.isPlayerDisabled ? (
						<VolumeX className="h-[1.2rem] w-[1.2rem]" />
					) : (
						<Settings className="h-[1.2rem] w-[1.2rem]" />
					)}
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				className="w-56"
				side="bottom"
				sideOffset={8}
				alignOffset={-8}
				align="end"
			>
				<DropdownMenuGroup>
					{spotify.isPlayerDisabled ? (
						<DropdownMenuItem
							onClick={() => spotify.actions.setPlayerDisabled(false)}
						>
							<Volume2 className="mr-2 square-4" />
							<span>Enable player</span>
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem
							onClick={() => spotify.actions.setPlayerDisabled(true)}
						>
							<VolumeX className="mr-2 square-4" />
							<span>Disable player</span>
						</DropdownMenuItem>
					)}

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							{theme === 'light' ? (
								<Sun className="square-4 mr-2" />
							) : (
								<Moon className="square-4 mr-2" />
							)}
							<span>Toggle theme</span>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem onClick={() => setTheme('light')}>
									<Sun className="square-4 mr-2" />
									<span>Light</span>
									{theme === 'light' && <Check className="square-4 ml-auto" />}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme('dark')}>
									<Moon className="square-4 mr-2" />
									<span>Dark</span>
									{theme === 'dark' && <Check className="square-4 ml-auto" />}
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => setTheme('system')}>
									<Settings className="square-4 mr-2" />
									<span>System</span>
									{theme === 'system' && <Check className="square-4 ml-auto" />}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={() => {
						spotify.sdk.logOut();
						navigate({ to: '/login' });
					}}
				>
					<LogOut className="mr-2 square-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
