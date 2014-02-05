/**
 * Windows launching.
 */
var path = require('path'),
	wrench = require('wrench'),
	Launcher = require('../launcher').Launcher,
	log = require('../log'),
	programs = require('./programs'),
	Paths = require('./paths');

exports.Launcher = WinLauncher;

function WinLauncher(options) {
	Launcher.call(this, options);
}

// extend our base class
WinLauncher.prototype.__proto__ = Launcher.prototype;

WinLauncher.prototype.launch = function(options, args, callback) {
	var paths = Paths.fetch(options),
		name = options.name;

	log.info(name.green + ' is now being built...');
	// TODO: If we're not running under --debug, it'd be nice to show a progress bar. This could take a bit to complete.
	programs.msbuild('"' + paths.solutionFile + '" /p:Platform="Win32"', function didBuild(err) {
		if (err) {
			log.error('Project failed to build: msbuild returned an error.');
			!log.shouldLog('debug') && log.error('(Hint: Use the --debug build to get more information on what failed.)');
			log.fatal(err);
		}
		else {
			findAppX();
		}
	}, { sdk: options.sdk });

	function findAppX() {
		var lookIn = path.join(paths.appDir, "AppPackages"),
			files = wrench.readdirSyncRecursive(lookIn).filter(function(f) {
				return f.match(/Debug\.appx$/);
			});
		if (!files || !files.length) {
			log.fatal('Could not find a generated Debug.AppX for your app.');
		}
		else {
			addAppX(path.join(lookIn, files[0]));
		}
	}

	function addAppX(at) {
		log.debug('Installing the app...');
		programs.powershell('Add-AppxPackage "' + at + '"', function ran(err) {
			if (err) {
				var strErr = String(err).replace(/[\r\n]/g, ''),
					alreadyInstalled = strErr.match('Remove package ([^ ]+) before installing')
						|| strErr.match('Deployment of package ([^ ]+) was blocked because the provided package has the same identity')
						|| strErr.match('The conflicting package is ([^ ]+) and it was published by'),
					notTrusted = strErr.match('The root certificate of the signature in the app package or bundle must be trusted'),
					needsSideloading = strErr.match('or a sideloading-enabled system');
				if (notTrusted) {
					openPVK();
				}
				else if (needsSideloading) {
					askForSideloading();
				}
				else if (alreadyInstalled) {
					removeAppX(at, alreadyInstalled[1].trim());
				}
				else {
					log.error('Failed to install the app.');
					!log.shouldLog('debug') && log.error('(Hint: Use the --debug build to get more information on what failed.)');
					log.fatal(err);
				}
			}
			else {
				log.debug('App installed.');
				runAppX();
			}
		});
	}

	function openPVK() {
		var pfx = path.join(paths.appDir, options.pfx);
		log.error('You need to import the .pfx to LOCAL MACHINE in to the TRUSTED ROOT CERTIFICATION AUTHORITIES store.\n');
		log.error('\t1. For "Store Location" choose "Local Machine" and click "Next".');
		log.error('\t2. Approve any User Access Control prompts you receive.');
		log.error('\t3. For "File to Import" and "Private key protection", no changes are necessary. Click "Next" twice.');
		log.error('\t4. For "Certificate Store", choose "Place all certificates in the following store".');
		log.error('\t5. Click "Browse...".');
		log.error('\t6. Select "Trusted Root Certification Authorities" and click "OK".');
		log.error('\t7. Click "Next" then "Finish".\n');
		log.error('Opening the wizard for ' + pfx.bold);
		programs.explorer('"' + pfx + '"', function ran() {
			log.fatal('Please re-run hyperloop after successfully following the above instructions.');
		});
	}

	function askForSideloading() {
		var pfx = path.join(paths.appDir, options.pfx);
		log.error('You need to enable application sideloading on this machine.\n');
		log.error('In a moment, your Local Group Policy Editor should open..\n');
		log.error('\t1. Click to expand ' + 'Computer Configuration'.bold + ', ' + 'Administrative Templates'.bold + ', ' + 'Windows Components'.bold + ', and then ' + 'App Package Deployment'.bold + '.');
		log.error('\t2. Double-click the ' + 'Allow development of Windows Store apps without installing a developer license'.bold + ' setting.');
		log.error('\t3. In the Allow development of Windows Store apps without installing a developer license window, click ' + 'Enabled'.bold + ' and then click ' + 'OK'.bold + '.');
		log.error('\t4. Double-click the ' + 'Allow all trusted apps to install'.bold + ' setting.');
		log.error('\t5. In the Allow all trusted apps to install window, click ' + 'Enabled'.bold + ' and then click ' + 'OK'.bold + '.');
		log.error('Running ' + 'gpedit.msc'.bold);
		programs.gpedit('', function ran() {
			log.fatal('Please re-run hyperloop after successfully following the above instructions.');
		});
	}

	function removeAppX(at, oldID) {
		log.debug('Uninstalling an old version of the app...');
		programs.powershell('Remove-AppxPackage ' + oldID, function ran(err) {
			if (err) {
				log.error('Failed to uninstall your app.');
				!log.shouldLog('debug') && log.error('(Hint: Use the --debug build to get more information on what failed.)');
				log.error(err);
				log.fatal('Please manually uninstall the app before trying again.');
			}
			else {
				addAppX(at);
			}
		});
	}

	function runAppX() {
		programs.explorer(options.name.toLowerCase() + ':', function ran(err) {
			// TODO: Sometimes, it doesn't launch. Or it doesn't focus. Not sure which.
			log.info(name.green + ' successfully installed and launched:\n\t' + paths.solutionFile.green + '\n\n');
			callback();
		});
	}

};