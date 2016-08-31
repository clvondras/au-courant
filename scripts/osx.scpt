global frontApp, frontAppName, windowTitle, windowURL
set windowTitle to ""
set windowURL to "null"
tell application "System Events"
	set frontApp to first application process whose frontmost is true
	set frontAppName to name of frontApp
	if frontAppName is "Google Chrome" then
		tell application "Google Chrome"
			set windowURL to URL of active tab of front window
			set windowTitle to title of active tab of front window
		end tell
	else
		tell frontApp
			tell (1st window whose value of attribute "AXMain" is true)
				set windowTitle to value of attribute "AXTitle"
			end tell
		end tell
	end if
end tell
return {frontAppName, windowTitle, windowURL}
